import React, {Fragment, useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Spinner from '../layout/Spinner';
import {getCurrentProfile, deleteAccount} from '../../actions/profile';
import {Link} from 'react-router-dom';
import DashboardActions from './DashboardActions';
import Education from './Education';
import Experience from './Experience';

const Dashboard = ({getCurrentProfile, auth: {user}, deleteAccount, profile:{profile, loading}}) => {
    useEffect(() => {
        getCurrentProfile();
    }, [getCurrentProfile]);
    return loading && profile === null ? <Spinner /> : 
    <section className="container">
        <Fragment>
            <h1 className='large text-primary'>Dashboard</h1>
            <p className='lead' >
            <i className='fas fa-user'> Welcome {user && user.name}</i></p>
        </Fragment>
        {profile !== null ? (
            <Fragment>
                <DashboardActions />
                <Experience experience = {profile.experience}/>
                <Education education = {profile.education}/>

                <div className="my-2">
                    <button className="btn btn-danger" onClick={() => deleteAccount()}>
                        <i className="fas fa-user-minus" /> Delete My Account
                    </button>
                </div>
            </Fragment>
        ):(
            <Fragment>
                <p>You have not setup your profile, please add now</p>
                <Link to='/create-profile' className='btn btn-primary my-1'>
                    Create Profile
                </Link>
            </Fragment>
        )}
    </section>
};

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    deleteAccount: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    profile: state.profile
});

export default connect(mapStateToProps , {getCurrentProfile, deleteAccount})(Dashboard);
