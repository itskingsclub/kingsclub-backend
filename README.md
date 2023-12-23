# Kings API Documentation

1. Register User
2. Log In
3. Verify OTP
4. Create Challenge
5. Update Challenge

Lets see then in action...

01.  ### Register User

        https://api-kings.vercel.app/user/register

        ```javascript
            {
                "name": "Test User",
                "mobile": "9000000000",
                "email":"test@gmail.com",
                "referral_code":"FG6235"
            }
        ```

        **[⬆ Back to Top](#kings-api-documentation)**

02.  ### Log In

        https://api-kings.vercel.app/auth/log-in/

        ```javascript
            {
                "mobile_number":"9000000000"
            }
        ```

        **[⬆ Back to Top](#kings-api-documentation)**

03.  ### Verify OTP

        https://api-kings.vercel.app/auth/verify-otp/

        ```javascript
            {
                "mobile_number":"9000000000",
                "pin":"9267"
            }
        ```

        **[⬆ Back to Top](#kings-api-documentation)**

04.  ### Create Challenge

        https://api-kings.vercel.app/challenge/create

        ```javascript
            {
                "amount": 100,
                "creator": 1
            }
        ```

        **[⬆ Back to Top](#kings-api-documentation)**

05.  ### Update Challenge

        https://api-kings.vercel.app/challenge/update

        ```javascript
            {
                "id": 1,
                "joiner": "1111111117",
                "challenge_status": "Waiting",
                "updated_by": "1111111117",
                "room_code":"12345678"
            }
        ```

        **[⬆ Back to Top](#kings-api-documentation)**

## Thank You

Thanks for reading 😊