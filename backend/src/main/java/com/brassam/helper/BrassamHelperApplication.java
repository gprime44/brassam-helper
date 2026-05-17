package com.brassam.helper;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@org.springframework.boot.context.properties.ConfigurationPropertiesScan
public class BrassamHelperApplication {

	public static void main(String[] args) {
		SpringApplication.run(BrassamHelperApplication.class, args);
	}

}
