plugins {
	java
	id("org.springframework.boot") version "4.0.6"
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
	implementation("org.springframework.boot:spring-boot-starter-web")
	developmentOnly("org.springframework.boot:spring-boot-devtools")
	
	// Lombok & MapStruct
	compileOnly("org.projectlombok:lombok")
	annotationProcessor("org.projectlombok:lombok")
	implementation("org.mapstruct:mapstruct:1.6.3")
	annotationProcessor("org.mapstruct:mapstruct-processor:1.6.3")
	
	implementation("org.xerial:sqlite-jdbc:3.49.1.0")
	implementation("org.hibernate.orm:hibernate-community-dialects:6.6.1.Final")
	runtimeOnly("com.h2database:h2")
	
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("org.springframework.boot:spring-boot-starter-webmvc-test")
}

tasks.withType<Test> {
	useJUnitPlatform()
	jvmArgs("--enable-native-access=ALL-UNNAMED", "-Xshare:off")
}

tasks.withType<org.springframework.boot.gradle.tasks.run.BootRun> {
	jvmArgs("--enable-native-access=ALL-UNNAMED", "-Xshare:off")
}

tasks.register<org.springframework.boot.gradle.tasks.run.BootRun>("bootRunDev") {
	group = "application"
	description = "Runs this project as a Spring Boot application with the 'dev' profile"
	mainClass.set("com.brassam.helper.BrassamHelperApplication")
	classpath = sourceSets["main"].runtimeClasspath
	systemProperty("spring.profiles.active", "dev")
}
