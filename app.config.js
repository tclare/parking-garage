export default ({config}) => {
    return {
        ... config,
        extra: {
            apiGatewayInvokeUrl: process.env.CAR_PARK_API_GATEWAY_INVOKE_URL,
            apiGatewayAuthorization: process.env.CAR_PARK_AUTHORIZATION
        }
    };
}