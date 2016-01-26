package eu.seaclouds.platform.discoverer.service;

import com.mongodb.MongoClient;
import eu.seaclouds.platform.discoverer.api.*;
import eu.seaclouds.platform.discoverer.core.Discoverer;
import eu.seaclouds.platform.discoverer.core.DiscovererConfiguration;
import io.dropwizard.Application;
import io.dropwizard.setup.Environment;
import org.eclipse.jetty.servlets.CrossOriginFilter;
import javax.servlet.DispatcherType;
import java.util.EnumSet;
import javax.servlet.FilterRegistration;

public class DiscovererApplication extends Application<DiscovererConfiguration> {

    public static void main(String[] args) throws Exception {
        new DiscovererApplication().run(args);
    }

    @Override
    public void run(DiscovererConfiguration configuration, Environment environment) {

        MongoClient mongoClient = new MongoClient(configuration.getDatabaseURL(), configuration.getDatabasePort());

        Discoverer discoverer = new Discoverer(mongoClient, configuration.getActiveCrawlers());
        final FilterRegistration.Dynamic cors = environment.servlets().addFilter("CORS", CrossOriginFilter.class);
        cors.setInitParameter("allowedOrigins", "*");
        cors.setInitParameter("allowedHeaders", "X-Requested-With,Content-Type,Accept,Origin");
        cors.setInitParameter("allowedMethods", "OPTIONS,GET,PUT,POST,DELETE,HEAD");

        cors.addMappingForUrlPatterns(EnumSet.allOf(DispatcherType.class), true, "/*");

        environment.jersey().register(new DiscovererAPI(discoverer));
    }
}
