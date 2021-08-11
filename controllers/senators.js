
import {Senator} from "../models/senator.js"
import { User } from "../models/user.js"
import { createJWT } from "./auth.js"

export {
  addToWatchlist,
  getUserSenators,
}


function addToWatchlist (req, res) {
  Senator.findOne({name:req.body.name})
  .then(senator => {
    if (senator) {
      return senator._id
    }
    const sen = new Senator(req.body)
    sen.save()
    return sen._id
  })
  .then(senId => {
    User.findById(req.user._id)
    .then(user => {
      if (user.senators.includes(senId) === false) {
        user.senators.push(senId)
        user.save()
        const token = createJWT(user)
          res.json({ token })
      }
    })
  })
}

function getUserSenators (req, res) {
  User.findById(req.user._id)
  .populate("senators")
  .populate("reps")
  .then(user => {
    res.json(user)
  })
}