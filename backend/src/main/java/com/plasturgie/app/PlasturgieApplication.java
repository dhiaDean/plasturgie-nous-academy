package com.plasturgie.app;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.core.env.Environment;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import java.util.Arrays;

@SpringBootApplication
@EntityScan("com.plasturgie.app.model")
@EnableJpaRepositories("com.plasturgie.app.repository")
@EnableJpaAuditing
public class PlasturgieApplication {
    
    private static final Logger logger = LoggerFactory.getLogger(PlasturgieApplication.class);

    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(PlasturgieApplication.class);
        Environment env = app.run(args).getEnvironment();
        
        String protocol = "http";
        if (env.getProperty("server.ssl.key-store") != null) {
            protocol = "https";
        }
        
        String activeProfiles = Arrays.toString(env.getActiveProfiles());
        String port = env.getProperty("server.port");
        
        logger.info("\n----------------------------------------------------------\n\t" +
                "Application '{}' is running!\n\t" +
                "Profile(s): {}\n\t" +
                "Access URLs:\n\t" +
                "Local: \t\t{}://localhost:{}\n\t" +
                "----------------------------------------------------------",
                env.getProperty("spring.application.name"),
                activeProfiles,
                protocol,
                port);
    }
}