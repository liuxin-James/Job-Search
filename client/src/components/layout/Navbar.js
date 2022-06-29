import React, {Fragment} from 'react'
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {logout} from '../../actions/auth';

const Navbar = ({auth: {isAuthenticated, loading}, logout}) => {
  const authlinks = (
    <ul>
      <li>
        <Link to="/profiles">Candidates</Link>
      </li>
      <li>
        <Link to="/posts">Posts</Link>
      </li>
      <li>
        <Link to='/dashboard'>
          <i className='fas fa-user'/>{' '}
          <span className='hide-sm'>Dahsboard</span>
        </Link>
      </li>

      <li>
        <a onClick={logout} href = "#!">
          <i className='fas fa-sign-out-alt'/>{' '}
          <span className='hide-sm'>Logout</span>
        </a>
      </li>
    </ul>
  );
  
  const guestlinks = (
    <ul>
      <li><Link to="/profiles">Candidates</Link></li>
      <li><Link to="/register">Register</Link></li>
      <li><Link to="/login">Login</Link></li>
    </ul>
  );

  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/"><i className="fa fa-bullseye"></i> JobSearch</Link>
      </h1>
      {!loading && (<Fragment> {isAuthenticated ? authlinks: guestlinks}</Fragment>)}
    </nav>
  )
}

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};


const mapStateToProps = state => ({
  auth: state.auth
});


export default connect(mapStateToProps, {logout})(Navbar);