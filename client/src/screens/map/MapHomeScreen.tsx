import {Button, Text, View} from 'react-native';
import useAuth from '~/hooks/queries/useAuth';

const MapHomeScreen = () => {
  const {logoutMutation} = useAuth();
  return (
    <View>
      <Text>맵 스크린</Text>
      <Button title="로그아웃" onPress={() => logoutMutation.mutate(null)} />
    </View>
  );
};

export default MapHomeScreen;
