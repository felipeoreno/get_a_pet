// import React, { useContext, useState } from 'react'
// import { Link } from 'react-router-dom'
// import api from '../../utils/api'

// //contexto
// import { Context } from '../../context/UserContext'

// function NavBar() {
//     const { authenticated, logout } = useContext(Context)
//     const [token] = useState(localStorage.getItem('token') || '')
//     const [user, setUser] = useState({})

//     if(token){
//         api.get('/users/checkuser', {
//             headers: {
//             Authorization: `Bearer ${JSON.parse(token)}`
//             }
//         })
//             .then((response) => {
//                 setUser(response.data)
//             })
//     }
    
//     return (
//         <nav className='navbar bg-info-subtle'>
//             <div className='container'>
//                 <Link className='navbar-brand'>Logo</Link>
//                 <div>
//                     <ul className='navbar nav'>
//                         <li className='nav-item'>
//                             <Link className='nav-link' to='/'>Home</Link>
//                         </li>
//                         {!authenticated ? (
//                             <>
//                                 <li className='nav-item'>
//                                     <Link className='nav-link' to='/register'>Registrar</Link>
//                                 </li>
//                                 <li className='nav-item'>
//                                     <Link className='nav-link' to='/login'>Login</Link>
//                                 </li>
//                             </>
//                         ) : (
//                             <>
//                                 <li className='nav-item'>
//                                     <Link className='nav-link' to='/pet/create'>Cadastrar Pet</Link>
//                                 </li>
//                                 <li className='nav-item'>
//                                     <Link className='navbar-brand' to='/user/profile'><img
//                                         style={{ height: '30px' }}
//                                         className='rounded-circle m-3'
//                                         src={'http://localhost:5000/images/users/' + user.image}
//                                         alt='Perfil'
//                                     /></Link>
//                                 </li>
//                                 <li onClick={logout} className='nav-item'><Link className='nav-link' to='/'>Sair</Link></li>
//                             </>
//                         )}
//                     </ul>
//                 </div>
//             </div>
//         </nav>
//     )
// }

// export default NavBar




import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
//Contexto
import { Context } from '../../context/UserContext'

function NavBar() {
    const { authenticated, logout } = useContext(Context)

    return (
        <nav className='navbar bg-warning'>
            <div className='container'>
                <Link className='navbar-brand'>Logo</Link>
                <div>
                    <ul className='navbar nav'>
                        <li className='nav-item'>
                            <Link className='nav-link' to='/'>Home</Link>
                        </li>
                        {!authenticated ? (
                            <>
                                <li className='nav-item'>
                                    <Link className='nav-link' to='/register'>Registrar</Link>
                                </li>
                                <li className='nav-item'>
                                    <Link className='nav-link' to='/login'>Login</Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className='nav-item'>
                                    <Link className='nav-link' to='/user/profile'>Perfil</Link>
                                </li>
                                <li className='nav-item'>
                                    <Link className='nav-link' to='/pet/create'>Cadastrar Pet</Link>
                                </li>
                                <li onClick={logout} className='nav-item'><Link className='nav-link' to='/'>Sair</Link></li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default NavBar
