import { Router } from 'express';
import {
    createPlaylist,
    deletePlaylist,
    updatePlaylist,
    getPlaylistByUserId,
    getPlaylistById,
    addVideoToPlaylist,
    deleteVideoToPlaylist
} from "../controllers/playlist.controller.js"
import {verifyJWT} from "../middleware/auth.middleware.js"

const router = Router();

router.use(verifyJWT);

router.route("/").post(createPlaylist)

router.route("/:playlistId")
    .delete(deletePlaylist)
    .patch(updatePlaylist)
    .get(getPlaylistById)

router.route("/user/all/:userId").get(getPlaylistByUserId)

router.route("/:playlistId/:videoId")
    .post(addVideoToPlaylist)
    .delete(deleteVideoToPlaylist)

export default router