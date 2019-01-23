import React, { Component } from 'react';
import PropTypes from 'prop-types';

import UserPageViewProto from "@prisma-cms/front/lib/modules/pages/UsersPage/UserPage/View";
import UsersGroupsBlock from "@prisma-cms/front/lib/modules/pages/UsersPage/UserPage/View/Groups";

import NotificationTypes from "./NotificationTypes";
import ChatRooms from "./ChatRooms";
import EthWallet from "./EthWallet";
import Balances from "./EthWallet/Balances";
import PushNotifications from "./PushNotifications";

class UserPageView extends UserPageViewProto {



  getWalletAddress() {

    const object = this.getObjectWithMutations();

    let {
      ethWallet,
    } = object;

    const {
      address,
    } = this.getEthAccount() || {}

    return ethWallet || address;
  }


  getEthAccount() {

    const object = this.getObjectWithMutations();

    let {
      EthAccounts,
    } = object;

    return EthAccounts && EthAccounts[0] || null;

  }


  renderDefaultView() {

    const object = this.getObjectWithMutations();
    const inEditMode = this.isInEditMode();

    let {
      id: userId,
      EthAccounts,
    } = object;

    const {
      mutate,
    } = this.props;

    const {
      user: currentUser,
      Grid,
    } = this.context;


    const {
      id: currentUserId,
    } = currentUser || {}


    const ethAccount = this.getEthAccount();

    // const ethWallet = this.getWalletAddress();

    let ethAccountList = [];

    let pushNotifications;


    if (currentUserId && currentUserId === userId) {


      pushNotifications = <PushNotifications
      />

      // console.log("EthAccounts", EthAccounts, object);

      if (EthAccounts && EthAccounts.length) {

        ethAccountList = EthAccounts.map(n => {

          const {
            id,
          } = n;

          return <Grid
            key={id}
            item
            xs={12}
            md={6}
          >

            <Balances
              ethAccount={n}
              user={currentUser}
            // style={{
            //   marginTop: 20,
            // }}
            />

          </Grid>;
        });

      }

      ethAccountList.push(<Grid
        key={"AddEthAccount"}
        item
        xs={12}
        md={6}
      >

        <Balances
          // ethAccount={n}
          user={currentUser}
        // style={{
        //   marginTop: 20,
        // }}
        />

      </Grid>);

    }
    else if (ethAccount || (currentUserId && currentUserId === userId)) {
      ethAccountList = <Grid
        item
        xs={12}
        md={6}
      >

        <EthWallet
          // currentUserEthAccount={ethAccount}
          user={object}
          currentUser={currentUser}
        />
      </Grid>
    }

    return <Grid
      container
      spacing={16}
    >

      <Grid
        item
      >

        {this.renderAvatar()}

        {pushNotifications}

      </Grid>

      <Grid
        item
        xs
      >

        <Grid
          container
          spacing={16}
        >

          <Grid
            item
            xs={12}
          // md={6}
          >

            <ChatRooms
              user={object}
              currentUser={currentUser}
            />


          </Grid>


          {ethAccountList}


          {/* {ethAccount || (currentUserId && currentUserId === userId) ?
            <Grid
              item
              xs={12}
              md={6}
            >

              <EthWallet
                // currentUserEthAccount={ethAccount}
                user={object}
                currentUser={currentUser}
              />
            </Grid>
            : null
          } */}


          <Grid
            item
            xs={12}
            md={6}
          >

            <NotificationTypes
              user={object}
              inEditMode={inEditMode}
              mutate={mutate}
            />

          </Grid>

        </Grid>

      </Grid>



    </Grid>;

  }

  renderEditableView() {


    // return <UserView 
    //   {...this.props}
    // />

    const object = this.getObjectWithMutations();
    const inEditMode = this.isInEditMode();

    const {
      id,
      username,
      fullname,
    } = object;


    const {
      mutate,
    } = this.props;

    const {
      user: currentUser,
      Grid,
    } = this.context;


    const {
      changePassword,
    } = this.state;

    const {
    } = currentUser || {}

    const ethWallet = this.getWalletAddress();

    return <Grid
      container
      spacing={16}
    >

      <Grid
        item
      >

        {this.renderAvatar()}

      </Grid>

      <Grid
        item
        xs
      >

        <Grid
          container
          spacing={16}
        >

          <Grid
            item
            xs={12}
            md={6}
          >


            {/* <Grid
              item
              xs={12}
            >

              {this.getTextField({
                name: "ethWallet",
                helperText: "Сменить ethereum кошелек",
                label: "Адрес кошелька",
                value: ethWallet || "",
              })}

            </Grid> */}


            <Grid
              item
              xs={12}
            >

              {this.getTextField({
                name: "fullname",
                helperText: "Отображаемое на сайте имя",
                label: "Имя",
              })}

            </Grid>


            <Grid
              item
              xs={12}
            >

              <input
                style={{
                  height: 1,
                  opacity: 1,
                  padding: 0,
                  margin: 0,
                  border: 0,
                }}
              />

              <div>
                {this.getTextField({
                  name: "password",
                  type: "password",
                  label: "Пароль",
                  helperText: "Новый пароль",
                })}
              </div>

            </Grid>


            <Grid
              item
              xs={12}
            >

              {this.getTextField({
                name: "email",
                helperText: "Сменить емейл",
                label: "Емейл",
              })}

            </Grid>

          </Grid>

          <Grid
            item
            xs={12}
            md={6}
          >

            <NotificationTypes
              user={object}
              inEditMode={inEditMode}
              mutate={mutate}
            />

          </Grid>

        </Grid>

      </Grid>



    </Grid>;

  }

}


export default UserPageView;