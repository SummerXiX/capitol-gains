import { Router } from 'express'
import * as repsCtrl from "../controllers/reps.js"
import { decodeUserFromToken, checkAuth } from '../middleware/auth.js'

const router = Router()



/*---------- Public Routes -----------*/

router.post("/create", repsCtrl.create)


/*---------- Protected Routes ----------*/



export {
  router
}