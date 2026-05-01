import { ServerClient } from 'postmark';
import { POSTMARK_API_TOKEN } from '$env/static/private';

const postmarkClient = new ServerClient(POSTMARK_API_TOKEN);

export default postmarkClient;
