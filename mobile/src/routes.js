import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Main from './pages/Main';
import Profile from './pages/Profile';

const Routes = createAppContainer(
    createStackNavigator({
        Main:{
            screen: Main,
            navigationOptions: {
                title: 'DevRadar'
            },
        },
        Profile: {
            screen: Profile,
            navigationOptions: {
                title: 'Perfil no GitHub'
            },
        },
    }, {
        defaultNavigationOptions: {
            headerTitleAlign: 'center',
            headerTintColor: '#FFF',
            headerStyle: {
                backgroundColor: '#7b40e7',
            },
        },
    } )
);

export default Routes;


