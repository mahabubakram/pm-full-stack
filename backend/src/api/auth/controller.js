import { sign } from '../../services/jwt'
import { success } from '../../services/response/'
import request from 'superagent'
import { User } from '../user'
import {notFound} from '../../services/response'

export const login = ({ user }, res, next) =>
  sign(user.id)
    .then((token) => ({ token, user: user.view(true) }))
    .then(success(res, 201))
    .catch(next)

export const githubToken = ({ querymen: { query: { code } } }, res, next) => {
  request.post('https://github.com/login/oauth/access_token')
    .send({
      'client_id': 'c79330922d58f3537eac',
      'client_secret': 'e08a9049376927560a2d39bd31e8f258523388fe',
      'code': code
    })
    .set('accept', 'application/json')
    .then((result) => {
      // Calling the end function will send the request
      User.findOne({role: 'user'})
        .then(notFound(result))
        .then((user) => user ? user.set({ githubToken: result.body.access_token }).save() : null)
        .then(res.redirect('https://www.facebook.com/'))
        .catch(next)
    })
}
