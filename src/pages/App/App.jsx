import React, { useState, useEffect } from 'react'
import { Route, Redirect, useHistory } from 'react-router-dom'



// Pages + Component

import * as houseApiService from "../../services/houseApiService"
import * as senateApiService from "../../services/senateApiService"

import NavBar from '../../components/NavBar/NavBar'
import SignUp from '../Signup/Signup'
import Login from '../Login/Login'
import Landing from '../Landing/Landing'
import Users from '../Users/Users'

// Services
import * as authService from '../../services/authService'
import { getUser } from "../../services/authService"

const App = () => {
	const history = useHistory()
	const [user, setUser] = useState(authService.getUser())

	const [currentUser, setCurrentUser] = useState()
	const [authenticated, setAuthenticated] = useState(false)

	const [houseTransactions, setHouseTransactions] = useState([])
	const [senateTransactions, setSenateTransactions] = useState([])
	
	useEffect(() => {
		async function getTransactions(){
			let house = await houseApiService.getAllHouseApi()
			console.log("this is house", house)
			setHouseTransactions(house)
			let senate = await senateApiService.getAllSenateApi()
			console.log("this is senate", senate)
			setSenateTransactions(senate)
		}
		getTransactions()
	}, []);



	// const handleSignupOrLogin = () => {
	// 	setUser(authService.getUser())
	// }

	const handleSignupOrLogin = async () => {
		const user = getUser()
		setCurrentUser(user)
		setAuthenticated(true)
	}

	useEffect(()=>{
		const verifyToken = async()=>{
			const token = localStorage.getItem("token")
			if (token) {
				try {
					const user = getUser()
					setCurrentUser(user)
					setAuthenticated(true)
				} catch (error){
					localStorage.clear()
				}
			}
		}
		verifyToken()
	},[authenticated])

	const handleLogout = () => {
      authService.logout();
      setUser(null);
      history.push("/");
    };

	return (
		<>
			<NavBar user={user} handleLogout={handleLogout}/>
			<Route exact path='/'>
				<Landing user={user} senateTrans={senateTransactions} />
			</Route>
			<Route exact path='/signup'>
				{user ? 
					<Redirect to='/' /> : 
					<SignUp handleSignupOrLogin={handleSignupOrLogin}/>
				}
			</Route>
			<Route exact path='/login'>
				{user ? 
					<Redirect to='/' /> : 
					<Login handleSignupOrLogin={handleSignupOrLogin}/>
				}
			</Route>
			<Route exact path='/users'>
				{user ? <Users /> : <Redirect to='/login' />}
			</Route>
		</>
	)
}
 
export default App
