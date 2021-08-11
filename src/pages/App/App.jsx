import React, { useState, useEffect } from "react"
import { Route, Redirect, useHistory } from "react-router-dom"
import "./App.css"

// Pages + Component

import Senators from "../Senators/Senators"
import Representatives from "../Representatives/Representatives"
import SenatorDetails from "../SenatorDetails/SenatorDetails"
import RepresentativeDetails from "../RepresentativeDetails/RepresentativeDetails"
import StockByRep from "../StockByRep/StockByRep"
import StockBySenator from "../StockBySenator/StockBySenator"
import StockDetails from "../StockDetails/StockDetails"
import NavBar from "../../components/NavBar/NavBar"
import SignUp from "../Signup/Signup"
import Login from "../Login/Login"
import Landing from "../Landing/Landing"
import Users from "../Users/Users"
import MyProfile from "../MyProfile/MyProfile"

// Services
import * as houseApiService from "../../services/houseApiService"
import * as senateApiService from "../../services/senateApiService"
import * as authService from "../../services/authService"
import * as representativeDoc from "../../Senator-Rep/Reps"
import * as senatorDoc from "../../Senator-Rep/Senators"
import { getUser, logout } from "../../services/authService"
import SideMenu from "../../components/SideMenu/SideMenu"
import { deleteFollowing } from "../../services/userService"

const App = () => {
	const history = useHistory()
	const [user, setUser] = useState(authService.getUser())

	// const [currentUser, setCurrentUser] = useState()
	const [authenticated, setAuthenticated] = useState(false)

	const [houseTransactions, setHouseTransactions] = useState([])
	const [senateTransactions, setSenateTransactions] = useState([])
	const [senatorList, setSenatorList] = useState([])
	const [representativeList, setRepresentativeList] = useState([])
	const [currentRepresentative, setCurrentRepresentative] = useState([])
	const [currentSenator, setCurrentSenator] = useState([])
	const [
		currentRepresentativeTransactions,
		setCurrentRepresentativeTransactions,
	] = useState([])
	const [currentSenatorTransactions, setCurrentSenatorTransactions] = useState(
		[]
	)
	const [movedStocks, setMovedStocks] = useState([])

	function compareReps(a, b) {
		if (a.name < b.name) {
			return -1
		}
		if (a.name > b.name) {
			return 1
		}
		return 0
	}

	const handleDeleteRep = async(repId) => {
		await deleteFollowing(repId)
		setUser({...user, reps: user.reps.filter(rep => rep._id !== repId)})
	}


	useEffect(() => {
		async function getTransactions() {
			let house = await houseApiService.getAllHouseApi()
			setHouseTransactions(house)
			let senate = await senateApiService.getAllSenateApi()
			setSenateTransactions(senate)
		}
		getTransactions()
	}, [])

	useEffect(() => {
		async function getSenators() {
			let senatorsArray = await senatorDoc.senators.map((senator) => senator)
			setSenatorList(senatorsArray)
		}
		async function getRepresentatives() {
			let representativesArray = await representativeDoc.representatives.map(
				(representative) => representative
			)
			setRepresentativeList(representativesArray)
		}
		getSenators()
		getRepresentatives()
	}, [])

	// const handleSignupOrLogin = () => {
	// 	setUser(authService.getUser())
	// }

	const handleSignupOrLogin = async () => {
		const user = getUser()
		setUser(user)
		setAuthenticated(true)
	}

	useEffect(() => {
		const verifyToken = async () => {
			const token = localStorage.getItem("token")
			if (token) {
				try {
					const user = getUser()
					setUser(user)
					setAuthenticated(true)
				} catch (error) {
					localStorage.clear()
				}
			}
		}
		verifyToken()
	}, [authenticated])

	const handleLogout = () => {
		logout()
		setUser(null)
		setAuthenticated(false)
		history.push("/")
	}

	return (
		<>
			<main>
				<NavBar
					user={user}
					authenticated={authenticated}
					handleLogout={handleLogout}
				/>
				<div className="app-main-container">
					<div className="app-side-menu">
						<SideMenu />
					</div>
					<div className="app-main-content">
						<Route exact path="/">
							<Landing user={user} senateTrans={senateTransactions} />
						</Route>
						<Route exact path="/signup">
							{user ? (
								<Redirect to="/" />
							) : (
								<SignUp handleSignupOrLogin={handleSignupOrLogin} />
							)}
						</Route>
						<Route exact path="/login">
							{user ? (
								<Redirect to="/" />
							) : (
								<Login handleSignupOrLogin={handleSignupOrLogin} />
							)}
						</Route>
						<Route exact path="/users">
							{user ? <Users /> : <Redirect to="/login" />}
						</Route>
						<Route exact path="/senators">
							{user ? (
								<Senators senatorList={senatorList} />
							) : (
								<Redirect to="/login" />
							)}
						</Route>
						<Route exact path="/representatives">
							{user ? (
								<Representatives representativeList={representativeList} />
							) : (
								<Redirect to="/login" />
							)}
						</Route>
						<Route exact path={`/senators/:senatorName`}>
							{user ? (
								<SenatorDetails
									senateTransactions={senateTransactions}
									senatorList={senatorList}
									currentSenator={currentSenator}
									setCurrentSenator={setCurrentSenator}
									currentSenatorTransactions={currentSenatorTransactions}
									setCurrentSenatorTransactions={setCurrentSenatorTransactions}
									movedStocks={movedStocks}
									setMovedStocks={setMovedStocks}
								/>
							) : (
								<Redirect to="/login" />
							)}
						</Route>
						<Route exact path={`/representatives/:representativeName`}>
							{user ? (
								<RepresentativeDetails
									houseTransactions={houseTransactions}
									currentRepresentative={currentRepresentative}
									setCurrentRepresentative={setCurrentRepresentative}
									currentRepresentativeTransactions={
										currentRepresentativeTransactions
									}
									setCurrentRepresentativeTransactions={
										setCurrentRepresentativeTransactions
									}
									movedStocks={movedStocks}
									setMovedStocks={setMovedStocks}
									representativeList={representativeList}
								/>
							) : (
								<Redirect to="/login" />
							)}
						</Route>
						<Route
							exact
							path="/representatives/:representativeName/:ticker/:date"
						>
							<StockByRep
								houseTransactions={houseTransactions}
								currentRepresentative={currentRepresentative}
								setCurrentRepresentative={setCurrentRepresentative}
								currentRepresentativeTransactions={
									currentRepresentativeTransactions
								}
								setCurrentRepresentativeTransactions={
									setCurrentRepresentativeTransactions
								}
								// movedStocks={moverStocks}
								// setMovedStocks={setMoverStocks}
								representativeList={representativeList}
							/>
						</Route>
						<Route
							exact
							path="/senators/:senatorName/:ticker/:month/:day/:year"
						>
							<StockBySenator
								senateTransactions={senateTransactions}
								senatorList={senatorList}
								currentSenator={currentSenator}
								setCurrentSenator={setCurrentSenator}
								currentSenatorTransactions={currentSenatorTransactions}
								setCurrentSenatorTransactions={setCurrentSenatorTransactions}
							/>
						</Route>
						<Route exact path={`/myProfile/:myProfile`}>
							{user ? (
								<MyProfile currentUser={user}
								handleDeleteRep={handleDeleteRep}
								/>
							) : (
								<Redirect to="/login" />
							)}
						</Route>
						<Route exact path="/stocks/:ticker">
							<StockDetails
								senateTransactions={senateTransactions}
								senatorList={senatorList}
								houseTransactions={houseTransactions}
								representativeList={representativeList}
							/>
						</Route>
					</div>
				</div>
			</main>
		</>
	)
}

export default App
