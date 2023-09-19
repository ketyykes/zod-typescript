import { z } from 'zod';

parse;
export function parse() {
    const userSchema = z.object({
        name: z.string(),
        age: z.number().positive(),
        email: z.string().email(),
    });
    // example 1
    const userData = {
        name: 'John',
        age: 25,
        email: 'john@example.com',
    };

    //example 2
    // const userData = {
    //     name: 'John',
    //     age: 25,
    //     email: 'john',
    // };

    try {
        const user = userSchema.parse(userData);
        console.log(user);
    } catch (error) {
        console.error(error);
    }
}

// export function safeParse() {
//     const userSchema = z.object({
//         name: z.string(),
//         age: z.number().positive(),
//         email: z.string().email(),
//     });

//     const userData = {
//         name: 'John',
//         age: 25,
//         email: 'john',
//     };

//     const result = userSchema.safeParse(userData);
//     console.log(result);

//     if (result.success) {
//         const user = result.data;
//         console.log(user);
//     } else {
//         const validationErrors = result.error.issues;
//         console.error(validationErrors);
//     }
// }

// export function tuple() {
//     const TupleSchema = z.tuple([z.string(), z.number()]).rest(z.boolean());
//     const result = TupleSchema.parse(['hello', 1, true, false]);
//     console.log(result);
// }
