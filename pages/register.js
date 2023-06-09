/* eslint-disable react/react-in-jsx-scope */
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from 'react';
import axios from 'axios';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import styles from '../styles/loginRegister.module.css';

const registerSchema = yup.object().shape({
    username: yup
        .string()
        .min(3, 'Username must be at least 3 characters long')
        .max(18, 'Username must be at most 18 characters long')
        .required('Username is required'),
    email: yup
        .string()
        .email('Invalid email address')
        .required('Email is required'),
    password: yup
        .string()
        .min(6, 'Password must be at least 6 characters long')
        .required('Password is required'),
});

const Register = () => {
    const { register, handleSubmit, formState } = useForm({
        resolver: yupResolver(registerSchema),
        mode: 'onBlur',
    });
    const { errors } = formState;
    const [serverErrors, setServerErrors] = useState({});
     
    const router = useRouter();

    const handleLoginPage = (e) => {
        e.preventDefault();
        router.push("/login")
    };
    
    const onSubmit = async (data) => {  
        try {
            const response = await axios.post('./api/user/register', data);
            console.log('234567876543', response);
            const redirectPath = router.query.redirect || '/';
            router.push(redirectPath);
        } catch (error) {
            if (error.response) {
                setServerErrors(error.response.data);
            } else {
                setServerErrors({ message: 'An error occurred. Please try again later.' });
            }
        }
    };

    return (
        <div>
            <div>
                <Head>
                    <title>Register Page</title>
                </Head>
            </div>
            <div className={styles.container}>
                <h1 className={styles.loginTitle}>Register</h1>
                <form className={styles.formInfo} onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles.inputInfo}>
                        <label className={styles.inputTitle} htmlFor="email">Email: </label>
                        <input 
                            className={styles.inputText} 
                            type="text" 
                            name="email" 
                            placeholder="Email"
                            {...register('email', { required: true })} 
                        /><br/>
                        {errors?.email && <span className={styles.errorMsg}>{errors.email.message}</span>}
                    </div>

                    <div className={styles.inputInfo}>
                        <label className={styles.inputTitle} htmlFor="username">Username: </label>
                        <input 
                            className={styles.inputText}
                            type="text" 
                            name="username" 
                            placeholder="Username"
                            {...register('username', { required: true })} 
                        /><br/>
                        {errors?.username && <span className={styles.errorMsg}>{errors.username.message}</span>}
                    </div>

                    <div className={styles.inputInfo}>
                        <label className={styles.inputTitle} htmlFor="password">Password: </label>
                        <input 
                            className={styles.inputText}
                            type="password" 
                            name="password" 
                            placeholder="Password"
                            {...register('password', { required: true })} 
                        /><br/>
                        {errors?.password && <span className={styles.errorMsg}>{errors.password.message}</span>}
                    </div>

                    {serverErrors.message && <div className={styles.errorMsg}>{serverErrors.message}</div>}

                    <button className={styles.submitBtn} type="submit" disabled={formState.isSubmitting}>
                        {formState.isSubmitting ? 'Submitting...' : 'Register'}
                    </button>
                </form>                
                <p>
                    Already have an account? Please 
                    <span className={styles.turnPage} onClick={handleLoginPage}> Login</span>.
                </p>
            </div>
        </div>
    )
};
 export default Register;