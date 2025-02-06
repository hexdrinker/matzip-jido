import {useRef} from 'react';
import {SafeAreaView, StyleSheet, TextInput, View} from 'react-native';
import CustomButton from '~/components/CustomButton';
import InputField from '~/components/InputField';
import useAuth from '~/hooks/queries/useAuth';
import useForm from '~/hooks/useForm';
import {validateSignup} from '~/utils';

const SignupScreen = () => {
  const {signupMutation, loginMutation} = useAuth();
  const passwordRef = useRef<TextInput | null>(null);
  const passwordConfirmRef = useRef<TextInput | null>(null);

  const signup = useForm({
    initialValue: {email: '', password: '', passwordConfirm: ''},
    validate: validateSignup,
  });

  const handleSubmit = () => {
    const {email, password} = signup.values;
    signupMutation.mutate(
      {email, password},
      {
        onSuccess: () => loginMutation.mutate({email, password}),
      },
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <InputField
          autoFocus
          placeholder="이메일"
          error={signup.errors.email}
          inputMode="email"
          touched={signup.touched.email}
          returnKeyType="next"
          submitBehavior={'submit'}
          onSubmitEditing={() => passwordRef.current?.focus()}
          {...signup.getTextInputProps('email')}
        />
        <InputField
          ref={passwordRef}
          placeholder="비밀번호"
          error={signup.errors.password}
          secureTextEntry
          touched={signup.touched.password}
          returnKeyType="next"
          submitBehavior={'submit'}
          textContentType="oneTimeCode"
          onSubmitEditing={() => passwordConfirmRef.current?.focus()}
          {...signup.getTextInputProps('password')}
        />
        <InputField
          ref={passwordConfirmRef}
          placeholder="비밀번호 확인"
          error={signup.errors.passwordConfirm}
          secureTextEntry
          textContentType="oneTimeCode"
          touched={signup.touched.passwordConfirm}
          onSubmitEditing={handleSubmit}
          {...signup.getTextInputProps('passwordConfirm')}
        />
      </View>
      <CustomButton
        label="회원가입"
        variant="filled"
        size="large"
        onPress={handleSubmit}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 30,
  },
  inputContainer: {
    gap: 20,
    marginBottom: 30,
  },
});

export default SignupScreen;
