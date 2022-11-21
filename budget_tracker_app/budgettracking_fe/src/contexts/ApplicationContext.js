import {createContext, useState, useEffect} from 'react';

export const ApplicationContext = createContext();

export default function ApplicationProvider(props){

    
    const [isUpdated, setIsUpdated] = useState([]);
    const [firstRender, setFirstRender] = useState([]);
    const [user, setUser] = useState({
        userId: "",
        firstName: "",
        lastName: "",
        isAdmin: ""
    });
    const [categories, setCategories] = useState([]);
    const [transactionDetails, setTransactionDetails] = useState([]);

    useEffect( () => {

        const userDetails = async () =>{

            try {
                
                const res = await fetch(
                    'https://kmybudgets-backend.herokuapp.com/api/users/details',{
                        headers: {
                            'Authorization' : `Bearer ${localStorage.getItem('token')}`
                    }
                });

                const userData = await res.json();

                const { firstName, lastName, isAdmin} = userData;

                setUser({
                    userId: userData._id,
                    firstName,
                    lastName,
                    isAdmin
                });

            } catch (err) {
                
                console.log(err);

            };
        };

        userDetails();
    }, []);

    useEffect( () => {

        const userCategories = async () =>{

            try {
                
                const res = await fetch( 
                    'https://kmybudgets-backend.herokuapp.com/api/categories/myCategories',{
                        headers: {
                            'Authorization' : `Bearer ${localStorage.getItem('token')}`
                        }
                });

                const userCategories = await res.json();

                if (userCategories.length === undefined) {
                    setCategories([])
                } else {

                    setCategories(userCategories);
                }

            } catch (err) {
    
                console.log(err);

            };
        };

        userCategories();
    }, [isUpdated, firstRender]);

    useEffect( () => {

        const userTransaction = async () =>{

            try {
                
                const res = await fetch(
                    'https://kmybudgets-backend.herokuapp.com/api/transactions/myTransactions',{
                        headers: {
                            'Authorization' : `Bearer ${localStorage.getItem('token')}`
                        }
                });

                const userTransaction = await res.json();

                setTransactionDetails(userTransaction);

            } catch (err) {
                
                console.log(err);

            };
        };

        userTransaction();
    }, [isUpdated, firstRender]);

    return(
        <ApplicationContext.Provider 
            value={{
                user,
                setUser,
                transactionDetails,
                setTransactionDetails,
                categories,
                setIsUpdated,
                setFirstRender

            }}
        >
            {props.children}
        </ApplicationContext.Provider>
    )
}