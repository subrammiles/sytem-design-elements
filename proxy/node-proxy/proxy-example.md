

#

Implement the Payment Service
t provides three payment endpoints:
HTTPmethod	    Endpoint	                  Purpose
GET	          /payments	         Retrieve all payments
GET 	      /payments/1	     Retrieve payment with ID 1
POST	      /payments	         Create a payment


The data is stored in memory, so it resets when you restart the service. This is for learning, not actual payment processing.