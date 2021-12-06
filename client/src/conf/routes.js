import Login from 'pages/preLogin/login/components/Login';
import Invitation from 'pages/preLogin/invitation/components/Invitation';
import Register from 'pages/preLogin/register/components/Register';
import PasswordResetMail from 'pages/preLogin/passwordReset/components/PasswordResetMail';
import PasswordResetMailComplete from 'pages/preLogin/passwordReset/components/PasswordResetMailComplete';
import PasswordResetInput from 'pages/preLogin/passwordReset/components/PasswordResetInput';
import PasswordResetComplete from 'pages/preLogin/passwordReset/components/PasswordResetComplete';
import PasswordInitSetInput from 'pages/preLogin/passwordInitSet/components/PasswordInitSetInput';
import PasswordInitSetComplete from 'pages/preLogin/passwordInitSet/components/PasswordInitSetComplete';

import Home from 'pages/logined/home/components/Home';
import ContestList from 'pages/logined/contestList/components/ContestList';
import OwnerContestList from 'pages/logined/ownerContestList/components/OwnerContestList';
import Contest from 'pages/logined/contest/components/Contest';
import Profile from 'pages/logined/profile/components/Profile';
import PasswordEdit from 'pages/logined/password/components/PasswordEdit';

export const preloginRoutes = [
  {
    name: 'login',
    path: '/login',
    exact: false,
    component: Login
  },
  {
    name: 'login',
    path: '/login/:token',
    exact: true,
    component: Login
  },
  {
    name: 'register',
    path: '/pre/register/:token',
    exact: true,
    component: Register
  },
  {
    name: 'invitation',
    path: '/pre/inviteContest/:token',
    exact: true,
    component: Invitation
  },
  {
    name: 'passwordResetMail',
    path: '/pre/passwordReset/mail',
    exact: true,
    component: PasswordResetMail
  },
  {
    name: 'passwordResetMailComplete',
    path: '/pre/passwordReset/mail/complete',
    exact: true,
    component: PasswordResetMailComplete
  },
  {
    name: 'passwordResetInput',
    path: '/pre/passwordReset/input/:token',
    exact: true,
    component: PasswordResetInput
  },
  {
    name: 'passwordResetComplete',
    path: '/pre/passwordReset/complete',
    exact: true,
    component: PasswordResetComplete
  },
  {
    name: 'passwordInitSetInput',
    path: '/pre/passwordInitSet/input/:token',
    exact: true,
    component: PasswordInitSetInput
  },
  {
    name: 'passwordInitSetComplete',
    path: '/pre/passwordInitSet/complete',
    exact: true,
    component: PasswordInitSetComplete
  },
]

export const loginedRoutes = [
  {
    name: 'home',
    path: '/',
    exact: true,
    component: Home
  },
  {
    name: 'contests',
    path: '/contests',
    exact: true,
    component: ContestList
  },
  {
    name: 'ownerContests',
    path: '/ownerContests',
    exact: true,
    component: OwnerContestList
  },
  {
    name: 'contest',
    path: '/contest/:eventId',
    exact: true,
    component: Contest
  },
  {
    name: 'profile',
    path: '/profile',
    exact: true,
    component: Profile
  },
  {
    name: 'passwordEdit',
    path: '/profile/password/edit',
    exact: true,
    component: PasswordEdit
  },
]