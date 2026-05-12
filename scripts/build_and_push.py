import subprocess
import os
import sys

# Configuration
BACKEND_IMAGE = "gprime44/helper-backend:latest"
FRONTEND_IMAGE = "gprime44/helper-frontend:latest"

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
        # On utilise shell=True sur Windows car c'est plus fiable pour trouver les .exe/.cmd
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

def main():
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    backend_dir = os.path.join(root_dir, "backend")
    frontend_dir = os.path.join(root_dir, "frontend")

    print("--- 🏗️  Building Backend (Local Gradle + Docker) ---")
    gradle_cmd = ".\gradlew.bat" if os.name == 'nt' else "./gradlew"
    run_command([gradle_cmd, "build", "-x", "test"], cwd=backend_dir)
    run_command(["docker", "build", "-t", BACKEND_IMAGE, "."], cwd=backend_dir)

    print("\n--- 🏗️  Building Frontend (Local NPM + Docker) ---")
    run_command(["npm", "install"], cwd=frontend_dir)
    run_command(["npm", "run", "build"], cwd=frontend_dir)
    run_command(["docker", "build", "-t", FRONTEND_IMAGE, "."], cwd=frontend_dir)

    print("\n--- 🚀 Pushing Images to Docker Hub ---")
    run_command(["docker", "push", BACKEND_IMAGE])
    run_command(["docker", "push", FRONTEND_IMAGE])

    print("\n✅ Done!")

if __name__ == "__main__":
    main()
