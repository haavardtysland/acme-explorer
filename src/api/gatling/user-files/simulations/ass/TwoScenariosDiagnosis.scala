package ass

import scala.concurrent.duration._

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import io.gatling.jdbc.Predef._

class TwoScenariosDiagnosis extends Simulation {

	val httpProtocol = http
		.baseUrl("http://localhost:8080/")
		
	val initHeaders = Map(
		"Content-Type" -> "application/json")

	val headers_0 = Map(
		"Authorization" -> "Bearer #{token}",
		"Content-Type" -> "application/json")


	object LoginAdmin {
		val loginAdmin = exec(http("POST ACTOR-ADMIN-LOGIN").
		post("/api/v0/Actors/Login").headers(initHeaders)
		.body(RawFileBody("actor-admin-login.json")).check(jsonPath("$.token").saveAs("token"))).pause(1)
	}
	
		val admin = scenario("Admin").exec(LoginAdmin.loginAdmin)

      
	object CreateCustomer {
		val createCustomer = exec(http("POST ACTOR-CUSTOMER2")
			.post("/api/v0/Actors")
			.body(RawFileBody("actor-customer.json")).check(status.in(200, 400))
			.headers(initHeaders))
		.pause(1)
	}
	
	object ShowActors {
		val showActors = exec(http("GET ALL ACTORS")
			.get("/api/v0/Actors/")
			.headers(headers_0))
		.pause(1)
	}

	object CreateManager {
		val createManager = exec(http("POST ACTOR-MANAGER")
			.post("/api/v0/Actors")
			.body(RawFileBody("actor-manager.json")).check(status.in(200, 400))
			.headers(headers_0))
		.pause(1)
	}

	object GetTrips {
		val getTrips = exec(http("GET ALL ACTORS")
			.get("/api/v0/Trips/")
			.headers(headers_0))
		.pause(1)
	}
									  
	val adminScn = scenario("Administrator").exec(LoginAdmin.loginAdmin, ShowActors.showActors, CreateManager.createManager, GetTrips.getTrips)
	val customerScn = scenario("Customer").exec(CreateCustomer.createCustomer)

	setUp(
		customerScn.inject(rampUsers(2000) during (100 seconds)),
		adminScn.inject(rampUsers(2000) during (100 seconds))
	).protocols(httpProtocol)
     .assertions(
        global.responseTime.max.lt(5000),    
        global.responseTime.mean.lt(1000),
        global.successfulRequests.percent.gt(95)
     )
}