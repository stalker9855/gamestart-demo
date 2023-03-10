import { Context } from '@/pages';
import { useContext, useState } from 'react';
import styles from '../styles/Auth.module.scss';


const Auth = () => {
  const [email,setEmail]=useState<string>('')
  const [password,setPassword]=useState<string>('')
  const {store} = useContext(Context)

    const [isRegistering, setIsRegistering] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
  
    const handleToggleAuth = () => {
        setIsRegistering(!isRegistering);
    }

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);
  
    return (
      <div className={styles.container}>
        <div className={`${styles.wrapper} ${isFocused ? styles.focused : ""}`}>
          <div className={styles.header}>
            <h2 className={`${styles.title} ${isRegistering ? styles.active : ""}`} onClick={handleToggleAuth}>Register</h2>
            <h2 className={`${styles.title} ${!isRegistering ? styles.active : ""}`} onClick={handleToggleAuth}>Login</h2>
          </div>
          <form className={styles.form} onFocus={handleFocus} onBlur={handleBlur}>
            <input onChange={e=>setEmail(e.target.value)} type="email" className={styles.input} placeholder="Email"  value={email}/>
            <input onChange={e=>setPassword(e.target.value)} type="password" className={styles.input} placeholder="Password"  value={password}/>
            {isRegistering?(<>
              {/* <input type="password" className={styles.input} placeholder="Confirm Password" value={password} /> */}
              <button onClick={()=>store.login(email,password)} className={styles.submit}>
              Register
            </button>
            </>)
            :(
            <button className={styles.submit} onClick={()=>store.registration(email,password)}>
            Login
          </button>
            )}
          </form>
        </div>
      </div>
    );
  };
  
  export default Auth;