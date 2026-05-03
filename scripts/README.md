# Create Admin User Script

A Node.js script to create admin users for your application.

## Usage

Run the script with the following command:

```bash
npm run create-admin "Full Name" "email@example.com" "password"
```

Or directly with node:

```bash
node scripts/createAdmin.js "Full Name" "email@example.com" "password" 
```

## Parameters

- **name** (string): The full name of the admin user
- **email** (string): The email address (must be unique)
- **password** (string): The password for the admin user

## Examples

```bash
npm run create-admin "John Admin" admin@example.com MySecurePass123
```

```bash
npm run create-admin "Sarah Developer" sarah@company.com dev-password-456
```

## Requirements

- MongoDB must be running and accessible
- `.env.local` file must contain the `MONGODB_URI` environment variable
- JWT_SECRET should be set in `.env.local` for authentication to work

## Error Handling

The script will:
- Exit with an error if the user with the same email already exists
- Exit with an error if MongoDB connection fails
- Exit with an error if not enough arguments are provided

## Security Notes

- Passwords are hashed using bcrypt before being stored in the database
- Admin users have full access to the application
- Use strong, unique passwords for admin accounts
