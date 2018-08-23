import { Router } from 'express'
import {githubToken, login} from './controller'
import { password, master } from '../../services/passport'
import {middleware as body} from 'bodymen'
import {schema} from '../user/model'
import { middleware as query } from 'querymen'

const { code } = schema.tree
const router = new Router()

/**
 * @api {post} /auth Authenticate
 * @apiName Authenticate
 * @apiGroup Auth
 * @apiPermission master
 * @apiHeader {String} Authorization Basic authorization with email and password.
 * @apiParam {String} access_token Master access_token.
 * @apiSuccess (Success 201) {String} token User `access_token` to be passed to other requests.
 * @apiSuccess (Success 201) {Object} user Current user's data.
 * @apiError 401 Master access only or invalid credentials.
 */
router.post('/',
  master(),
  password(),
  login)

router.get('/githubAccess',
  query({code: { type: String }}),
  githubToken)

export default router
