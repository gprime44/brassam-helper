plugins {
	java
	id("org.springframework.boot") version "4.0.0"
	id("io.spring.dependency-management") version "1.1.7"
}

group = "com.brassam"
version = "0.0.1-SNAPSHOT"
description = "Brassam Helper Backend"

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(25)
	}
}

repositories {
	mavenCentral()
}

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	implementation("org.springframework.boot:spring-boot-starter-liquibase")
	implementation("org.springframework.boot:spring-boot-starter-validation")
	implementation("org.springframework.boot:spring-boot-starter-webmvc")
	runtimeOnly("org.mariadb.jdbc:mariadb-java-client")
	runtimeOnly("com.h2database:h2")
	testImplementation("org.springframework.boot:spring-boot-starter-data-jpa-test")
	testImplementation("org.springframework.boot:spring-boot-starter-liquibase-test")
	testImplementation("org.springframework.boot:spring-boot-starter-validation-test")
	testImplementation("org.springframework.boot:spring-boot-starter-webmvc-test")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

tasks.withType<Test> {
	useJUnitPlatform()
}

tasks.register("start") {
    group = "application"
    description = "Starts the backend application with the 'dev' profile (H2 database)."
    dependsOn("bootRun")
}

tasks.named<org.springframework.boot.gradle.tasks.run.BootRun>("bootRun") {
    if (project.gradle.startParameter.taskNames.contains("start")) {
        args("--spring.profiles.active=dev")
    }
}
