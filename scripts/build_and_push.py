import subprocess
import os
import sys
import re

# Configuration
BACKEND_BASE_IMAGE = "gprime44/helper-backend"
FRONTEND_BASE_IMAGE = "gprime44/helper-frontend"

# On enrichit le PATH pour la session actuelle pour éviter les soucis de credentials docker etc.
if os.name == 'nt':
    extra_paths = [
        r"C:\Program Files\Docker\Docker\resources\bin",
        r"C:\Sources\nodejs",
        r"C:\Sources\jdk\bin",
        r"C:\Windows\system32",
        r"C:\Windows"
    ]
    os.environ["PATH"] = os.pathsep.join(extra_paths) + os.pathsep + os.environ.get("PATH", "")

def run_command(command_list, cwd=None):
    """Exécute une commande système."""
    is_windows = os.name == 'nt'
    cmd_str = " ".join(command_list)
    print(f"\n🚀 Running: {cmd_str}")
    
    try:
        result = subprocess.run(
            cmd_str if is_windows else command_list,
            cwd=cwd,
            check=True,
            shell=is_windows,
            text=True
        )
        return result
    except subprocess.CalledProcessError as e:
        print(f"❌ Error during command: {e}")
        sys.exit(1)

def get_project_version(backend_dir):
    """Extrait la version du fichier build.gradle.kts."""
    try:
        with open(os.path.join(backend_dir, "build.gradle.kts"), "r") as f:
            content = f.read()
            match = re.search(r'version\s*=\s*"([^"]+)"', content)
            if match:
                return match.group(1)
    except Exception as e:
        print(f"⚠️ Could not read version from build.gradle.kts: {e}")
    return "0.0.0"

def main():
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    backend_dir = os.path.join(root_dir, "backend")
    frontend_dir = os.path.join(root_dir, "frontend")

    version = get_project_version(backend_dir)
    print(f"📦 Project Version detected: {version}")

    backend_latest = f"{BACKEND_BASE_IMAGE}:latest"
    backend_versioned = f"{BACKEND_BASE_IMAGE}:{version}"
    frontend_latest = f"{FRONTEND_BASE_IMAGE}:latest"
    frontend_versioned = f"{FRONTEND_BASE_IMAGE}:{version}"

    print("\n--- 🏗️  Building Backend (Local Gradle + Docker) ---")
    gradle_cmd = ".\gradlew.bat" if os.name == 'nt' else "./gradlew"
    run_command([gradle_cmd, "build", "-x", "test"], cwd=backend_dir)
    run_command(["docker", "build", "-t", backend_latest, "-t", backend_versioned, "."], cwd=backend_dir)

    print("\n--- 🏗️  Building Frontend (Local NPM + Docker) ---")
    run_command(["npm", "install"], cwd=frontend_dir)
    run_command(["npm", "run", "build"], cwd=frontend_dir)
    run_command(["docker", "build", "-t", frontend_latest, "-t", frontend_versioned, "."], cwd=frontend_dir)

    print(f"\n--- 🚀 Pushing Images ({version} + latest) to Docker Hub ---")
    run_command(["docker", "push", backend_latest])
    run_command(["docker", "push", backend_versioned])
    run_command(["docker", "push", frontend_latest])
    run_command(["docker", "push", frontend_versioned])

    print("\n✅ Done!")

if __name__ == "__main__":
    main()
