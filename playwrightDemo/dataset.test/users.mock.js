const validData = [
    {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password456',
        address: '456 Elm St',
        gender: 'Female',
        country: 'USA',
    },
    {
        name: 'John Smith',
        email: 'john@example.com',
        password: 'password123',
        address: '123 Main St',
        gender: 'Male',
        country: 'India',
    },
    {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        password: 'password789',
        address: '789 Oak St',
        gender: 'Female',
        country: 'UK',
    }
];

const invalidData = {
    name: '',
    email: 'invalid-email',
    password: '123',
    address: '',
    gender: 'unknown',
    country: '',
   
};



export { validData, invalidData };


