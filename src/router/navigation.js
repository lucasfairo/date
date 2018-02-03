import { StackNavigator } from 'react-navigation';

// Screens
import { LaunchScreen } from '../components';

// Rout names
export const LAUNCH_ROUT = 'launch';

export default StackNavigator({
	[LAUNCH_ROUT]: {
		screen: LaunchScreen
	}
}, {
	initialRouteName: LAUNCH_ROUT,
	headerMode: 'none'
});
