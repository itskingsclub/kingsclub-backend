# Kings API Documentation

1. Register User
2. Log In
3. Verify OTP

Lets see then in action...

01.  ### Register User

        https://api-kings.vercel.app/user/register

        ```javascript
            {
                "user_name": "Test User",
                "email": "test@gmail.com",
                "password": "1234567890",
                "mobile_number":"1111111111"
            }
        ```

        **[⬆ Back to Top](#kings-api-documentation)**

02.  ### Log In

        https://api-kings.vercel.app/auth/log-in/

        ```javascript
            {
                "mobile_number":"1111111111"
            }
        ```

        **[⬆ Back to Top](#kings-api-documentation)**

03.  ### Verify OTP

        https://api-kings.vercel.app/auth/verify-otp/

        ```javascript
            {
                "mobile_number":"1111111111",
                "code":"9267"
            }
        ```

        **[⬆ Back to Top](#kings-api-documentation)**


## Thank You

Thanks for reading 😊