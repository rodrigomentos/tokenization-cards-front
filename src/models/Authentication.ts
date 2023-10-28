import IAuthentication from "../interfaces/IAuthentication";
export default class Authorization  implements IAuthentication{

    accessToken: string = '';    
    refreshToken: string = '';
    userId: string = '';
    userName: string = '';

    constructor() {
        let user: IAuthentication | null = JSON.parse( localStorage.getItem('CULQI_DATA') || '{}' );
        if(user && user.accessToken){
            this.accessToken = user.accessToken;
            this.refreshToken = user.refreshToken;
            this.userId = user.userId;
            this.userName = user.userName;
        }
    }

}
