import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Typography, Paper, Checkbox, IconButton, CircularProgress } from 'material-ui';
import { withStyles } from 'material-ui';

import WalletIcon from "material-ui-icons/AccountBalanceWallet";
import HelpIcon from "material-ui-icons/Help";
import CheckIcon from "material-ui-icons/Check";
import SendIcon from "material-ui-icons/Send";

import { Button } from 'material-ui';

import PrismaCmsComponent from "@prisma-cms/component";
import { TextField } from 'material-ui';

import NumberFormat from 'react-number-format';

import Web3 from "web3";
import gql from 'graphql-tag';

export const styles = theme => {

  // console.log(theme);
  return {
    root: {
      padding: 10,
      border: "2px solid transparent",
      "&.success": {
        borderColor: "green",
      },
      "&.failure": {
        borderColor: "red",
      },
    },
    icon: {
      color: theme.palette.primary[400],
    },
    actions: {
      marginTop: 15,
    },
    title: {
      marginBottom: 10,
    },
    paragraph: {
      marginTop: 10,
      marginBottom: 10,
    },
    textSuccess: {
      color: "green",
    },
  }
}

export const locales = {
  ru: {
    values: {
      "Your wallet": "Ваш кошелек",
      "User's wallet": "Кошелек пользователя",
      "Address": "Адрес",
      "Balance": "Баланс",
      "Send": "Отправить",
      "Error while creating wallet": "Не удалось создать кошелек",
      "Top up": "Пополнить",
      "You may": "Вы можете",
      "create new wallet": "создать новый кошелек",
      "or": "или",
      "set existing": "указать существующий",
      "Attention": "Внимание",
      "We are not liable for any transactions and losses from ethereum wallets.": "Мы не несем никакой ответственности за какие-либо операции и потери с ethereum-кошельков.",
      "This wallet is not a wallet in the literal sense of the word, but a link to your personal address in the system":
        "Данный кошелек не является кошельком в прямом смысле слова, а является ссылкой на ваш личный адрес в системе",
      "Close": "Закрыть",
      "Read more": "Читать подробней",
      "in wikipedia": "в википедии",
      "A new ethereum wallet will be created for you. The database will only save its public address, without any access keys.":
        "Для вас будет создан новый ethereum-кошелек. В базе сохранится только его публичный адрес, без каких-либо ключей доступа.",
      "Generate private key": "Сгенерировать приватный ключ",
      "Private key": "Приватный ключ",
      "The address will be determined by the private key": "По приватному ключу будет получен адрес",
      "Send data to your email": "Отправить данные на ваш емейл",
      "If you don't know exactly what it is and how it works, you'd better not start it now, but try to get a better idea about this system.":
        "Если вы не назнаете точно, что это такое и как работает, вам лучше не стоит его заводить сейчас, а попытаться получше узнать о этой системе.",
      "We do not store your private keys. The key is needed only to get the address of your wallet and make sure that you have access to it. No key will be shown.":
        "Мы не храним ваши приватные ключи. Ключ нужен только для того, чтобы получить адрес вашего кошелька и убедиться, что у вас есть к нему доступ. Никому ключ не будет показан.",
      "Private key must start with 0x": "Приватный ключ должен начинаться с 0x",
      "Could not decrypt private key": "Не удалось дешифровать приватный ключ",
      "The received address does not match the address of your wallet": "Полученный адрес не совпадает с адресом вашего кошелька",
      "No account received": "Не был получен аккаунт",
      "Your personal ethereum wallet will be replenished. The balance will be displayed on the site, but we have no control over your wallet and actions with it.":
        "Ваш личный этериум кошелек будет пополнен. Баланс будет отображаться на сайте, но мы никак не контролируем ваш кошелек и действия с ним.",
      "Enter your private key to make sure you have access to your wallet. Otherwise, you will transfer funds and you can not pick them up later.":
        "Введите ваш приватный ключ, чтобы убедиться, что у вас есть доступ к вашему кошельку. Иначе вы переведете средства и не сможете их потом забрать.",
      "We do not accept payment for the replenishment of the wallet. For replenishment, you can choose any service for the purchase of ethereum cryptocurrency.":
        "Мы не принимаем оплату на пополнение кошелька. Для пополнения вы можете выбрать любой сервис для покупки криптовалюты ethereum.",
      "We advise to use the service": "Мы советуем воспользоваться сервисом",
      "since they have a minimum replenishment amount of just 0.01 etherium, and we ourselves paid, they did not deceive us":
        "так как у них минимальная сумма пополнения всего 0.01 этериума, и мы сами оплачивали, они нас не обманули",
    },
  },
  en: {
    values: {
      "Приватный ключ должен начинаться с 0x": "Private key must start with 0x",
    },
  },
}

export class WalletBalances extends PrismaCmsComponent {


  static propTypes = {
    ...PrismaCmsComponent.propTypes,
    user: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    ethAccount: PropTypes.object,
    children: PropTypes.any,
  };


  // static defaultProps = {};


  constructor(props) {

    super(props);

    this.state = {
      ...this.state,
      showTopupBalanceForm: false,
      showForm: null,
      createInRequest: false,
      ethWalletPKSendEmail: true,
      showInfo: false,
      checkStatus: null,
      showSendEthForm: false,
      sendEthInRequest: false,
      amount: null,
      sendPrivateKey: "",
      sendSuccessTransaction: null,
    }
  }


  componentWillMount() {

    this.initLocales(locales);

    super.componentWillMount && super.componentWillMount();
  }


  async importWallet() {

    const {
      query: {
        updateUserProcessor,
      },
    } = this.context;

    const {
      createInRequest,
      ethWalletPK,
      ethWalletPKSendEmail,
    } = this.state;


    if (createInRequest) {
      return false;
    }

    this.setState({
      createInRequest: true,
    });


    await this.mutate({
      mutation: gql(updateUserProcessor),
      variables: {
        data: {
          ethWalletPK,
          ethWalletPKSendEmail,
        },
      },
    })
      .then(async r => {

        const {
          loadApiData,
        } = this.context;

        await loadApiData();

        this.setState({
          showForm: null,
          ethWalletPK: null,
        });
      })
      .catch(console.error);


    this.setState({
      createInRequest: false,
    });

  }


  async createWallet() {

    // console.log("Web3.givenProvider", Web3.givenProvider);
    // console.log("Web3", Web3);

    const web3 = new Web3(Web3.givenProvider);

    const account = web3.eth.accounts.create(web3.utils.randomHex(32));

    // console.log("account", account);

    if (!account) {
      this.addError(this.lexicon("Error while creating wallet"));
    }
    else {

      const {
        privateKey: ethWalletPK,
      } = account;

      this.setState({
        ethWalletPK,
        showForm: "importForm",
        ethWalletPKSendEmail: true,
      });

    }

  }


  checkWallet() {


    const {
      ethAccount,
    } = this.props;

    const {
      address,
    } = ethAccount || {};


    const {
      ethWalletPKCheck,
    } = this.state;


    let checkStatus;
    let errorMessage;


    const web3 = new Web3(Web3.givenProvider);

    let account;


    if (ethWalletPKCheck && !/^0x/.test(ethWalletPKCheck)) {
      errorMessage = this.lexicon("Private key must start with 0x");
      checkStatus = false;
    }
    else {

      try {
        account = web3.eth.accounts.privateKeyToAccount(ethWalletPKCheck);
      }
      catch (error) {
        // console.error("privateKeyToAccount Error", error);

        errorMessage = this.lexicon("Could not decrypt private key");
        checkStatus = false;

      }


      if (account) {

        if (address !== account.address) {
          errorMessage = this.lexicon("The received address does not match the address of your wallet");
          checkStatus = false;
        }
        else {
          checkStatus = true;
        }

      }
      else {
        errorMessage = this.lexicon("No account received");
        checkStatus = false;
      }

    }


    if (errorMessage) {
      this.addError(errorMessage);
    }

    this.setState({
      checkStatus,
    });

  }


  async sendEth() {

    const {
      query: {
        createEthTransactionProcessor,
      },
    } = this.context;

    const {
      amount,
      sendEthInRequest,
      sendPrivateKey: privateKey,
    } = this.state;


    const {
      ethAccount,
    } = this.props;

    const {
      address,
    } = ethAccount || {};

    if (sendEthInRequest) {
      return;
    }

    this.setState({
      sendEthInRequest: true,
    });


    await this.mutate({
      mutation: gql(createEthTransactionProcessor),
      variables: {
        data: {
          type: "SendEth",
          privateKey: privateKey || "",
          to: address,
          amount: parseFloat(amount),
        }
      },
    })
      .then(result => {

        // console.log("result", result);

        const {
          response,
        } = result.data || {};

        if (response) {

          const {
            success,
            data: transaction,
          } = response;


          if (success && transaction) {

            this.setState({
              sendSuccessTransaction: transaction,
              amount: null,
              showSendEthForm: false,
              sendPrivateKey: "",
            });

          }

        }

      })
      .catch(error => {
        console.error(error);
      });

    this.setState({
      sendEthInRequest: false,
    });

  }


  render() {

    const {
      user,
      ethAccount,
      classes,
      children,
      ...other
    } = this.props;

    const {
      user: currentUser,
      TransactionLink,
      Grid,
    } = this.context;

    const {
      address,
      balance,
    } = ethAccount || {};


    if (!user) {
      return null;
    }

    const {
      showTopupBalanceForm,
      showForm,
      ethWalletPK,
      ethWalletPKSendEmail,
      createInRequest,
      showInfo,
      ethWalletPKCheck,
      checkStatus,
      showSendEthForm,
      amount,
      sendPrivateKey,
      sendEthInRequest,
      sendSuccessTransaction,
    } = this.state;


    const {
      id: currentUserId,
      EthAccounts: currentUserEthAccounts,
    } = currentUser || {};


    const currentUserEthAccount = currentUserEthAccounts && currentUserEthAccounts[0] || null;

    const {
      balance: currentUserBalance,
    } = currentUserEthAccount || {}


    const {
      id: userId,
    } = user;


    let title;


    if (currentUserId && currentUserId === userId) {
      title = this.lexicon("Your wallet");
    }
    else {
      title = this.lexicon("User's wallet");
    }


    let output;

    let actions = [];


    if (ethAccount) {

      output = <Fragment>


        <Typography>
          {this.lexicon("Address")}: <a
            href={`https://etherscan.io/address/${address}`}
            target="_blank"
          >
            {address}
          </a>
        </Typography>

        <Typography>
          {this.lexicon("Balance")} Eth: {balance}
        </Typography>

      </Fragment>

      if (currentUserId) {

        if (currentUserId === userId) {



          /**
           * Пополнение баланса
           */

          if (showTopupBalanceForm) {

            actions.push(<div
              key="topupBalance"
            >
              <Typography
                variant="subheading"
                color="secondary"
              >
                {this.lexicon("Attention")}!
              </Typography>

              <Typography
                className={classes.paragraph}
              >
                {this.lexicon("Your personal ethereum wallet will be replenished. The balance will be displayed on the site, but we have no control over your wallet and actions with it.")}
              </Typography>

              <Typography
                className={classes.paragraph}
              >
                {this.lexicon("Enter your private key to make sure you have access to your wallet. Otherwise, you will transfer funds and you can not pick them up later.")}
              </Typography>

              <Grid
                container
                alignItems="center"
              >
                <Grid
                  item
                  xs
                >
                  {this.renderField(<TextField
                    name="ethWalletPKCheck"
                    label={this.lexicon("Private key")}
                    helperText={this.lexicon("The address will be determined by the private key")}
                    fullWidth
                    onChange={event => {
                      const {
                        name,
                        value,
                      } = event.target;

                      this.setState({
                        [name]: value,
                        checkStatus: null,
                      });
                    }}
                    value={ethWalletPKCheck || ""}
                  />)}
                </Grid>
                <Grid
                  item
                >
                  <IconButton
                    disabled={!ethWalletPKCheck}
                    onClick={event => this.checkWallet()}
                  >
                    <CheckIcon />
                  </IconButton>
                </Grid>
              </Grid>


              <Typography
                className={classes.paragraph}
              >
                {this.lexicon("We do not accept payment for the replenishment of the wallet. For replenishment, you can choose any service for the purchase of ethereum cryptocurrency.")}
              </Typography>

              <Typography
                className={classes.paragraph}
              >
                {this.lexicon("We advise to use the service")} <a
                  href="https://pocket-exchange.com/?ref_hash=685f16b842e617cb7814eff46d386fb6"
                  target="_blank"
                  rel="nofollow"
                >
                  pocket-exchange.com
                </a>, {this.lexicon("since they have a minimum replenishment amount of just 0.01 etherium, and we ourselves paid, they did not deceive us")}.
              </Typography>

            </div>);

          }



          actions.push(<Button
            key="showTopupBalanceForm"
            onClick={event => this.setState({
              showTopupBalanceForm: !showTopupBalanceForm,
            })}
          >
            {!showTopupBalanceForm ? this.lexicon("Top up") : "Cancel"}
          </Button>);

        }
        else {

          if (sendSuccessTransaction) {

            const {
              id,
            } = sendSuccessTransaction;

            actions.push(<div
              key="ethSendedSuccess"
            >

              <Typography
                className={classes.textSuccess}
              >
                Перевод успешно выполнен.
              </Typography>

              <Typography
              >
                Посмотреть данные транзакции можно <TransactionLink
                  object={sendSuccessTransaction}
                >
                  здесь
                </TransactionLink>.
              </Typography>

            </div>);

          }
          else if (showSendEthForm) {

            if (currentUserEthAccount) {

              /**
               * Проверяем достаточно ли баланса
               */
              // if (!currentUserBalance) {
              //   actions.push(<div
              //     key="sendEthFormNoAmount"
              //   >

              //     <Typography
              //       color="secondary"
              //     >

              //     </Typography>

              //   </div>)
              // }
              // else {

              let error;
              let helperText = "Внимательно перепроверьте сумму";

              let fieldProps = {};

              if (!currentUserBalance || currentUserBalance < amount) {
                error = true;
                helperText = "Недостаточно баланса. Пополните свой кошелек.";

                fieldProps.error = error;
              }

              const disabled = error || !amount ? true : false;


              actions.push(<div
                key="sendEthForm"
              >
                <Grid
                  container
                  alignItems="center"
                >

                  <Grid
                    item
                    xs={12}
                  >

                    {this.renderField(<NumberFormat
                      customInput={TextField}
                      label="Сумма в Eth"
                      name="amount"
                      helperText={helperText}
                      fullWidth
                      onChange={event => {
                        const {
                          name,
                          value,
                        } = event.target;
                        this.setState({
                          [name]: value,
                        });
                      }}
                      value={amount || ""}
                      {...fieldProps}
                    />)}
                  </Grid>

                  <Grid
                    item
                    xs
                  >
                    {this.renderField(<TextField
                      label="Приватный ключ"
                      name="privateKey"
                      helperText="Ключ должен начинаться с 0x"
                      fullWidth
                      onChange={event => {
                        const {
                          name,
                          value,
                        } = event.target;
                        this.setState({
                          sendPrivateKey: value,
                        });
                      }}
                      value={sendPrivateKey || ""}
                    />)}
                  </Grid>

                  <Grid
                    item
                  >
                    {sendEthInRequest ?
                      <CircularProgress

                      />
                      :
                      <IconButton
                        disabled={disabled}
                        onClick={event => this.sendEth()}
                      >
                        <SendIcon
                          style={{
                            color: !disabled ? "green" : undefined,
                          }}
                        />
                      </IconButton>
                    }
                  </Grid>

                </Grid>
              </div>);
              // }


            }
            else {
              actions.push(<div
                key="sendEthNoAccount"
              >
                <Typography
                  color="secondary"
                >
                  У вас еще нет своего кошелька. Создайте его в форме ниже.
                </Typography>
              </div>)
            }

          }

          actions.push(<Button
            key="sendEth"
            onClick={event => this.setState({
              showSendEthForm: !showSendEthForm,
              sendSuccessTransaction: null,
            })}
          >
            {showSendEthForm ? this.lexicon("Cancel") : `${this.lexicon("Send")} Eth`}
          </Button>);
        }

      }

    }
    else if (currentUserId && currentUserId === userId) {

      /**
       * Если кошелька нет и это текущий пользователь, предлагаем создать кошелек
       */


      let form;

      let locales = {
        "": "",
        "": "",
        "": "",
      }

      if (showForm) {



        switch (showForm) {

          case "createForm":

            form = <div
              className={classes.paragraph}
            >

              <Typography>
                {this.lexicon("A new ethereum wallet will be created for you. The database will only save its public address, without any access keys.")}
              </Typography>

              <Button
                size="small"
                variant="raised"
                onClick={event => this.createWallet()}
              >
                {this.lexicon("Generate private key")}
              </Button>

            </div>

            break;


          case "importForm":

            form = <div
              className={classes.paragraph}
            >

              {this.renderField(<TextField
                name="ethWalletPK"
                label={this.lexicon("Private key")}
                helperText={this.lexicon("The address will be determined by the private key")}
                fullWidth
                onChange={event => {
                  const {
                    name,
                    value,
                  } = event.target;
                  this.setState({
                    [name]: value,
                  });
                }}
                value={ethWalletPK || ""}
              />)}

              <div>
                <Checkbox
                  name="ethWalletPKSendEmail"
                  checked={ethWalletPKSendEmail ? true : false}
                  onChange={(event, checked) => {
                    this.setState({
                      ethWalletPKSendEmail: checked,
                    })
                  }}
                /> {this.lexicon("Send data to your email")}
              </div>

              <Button
                size="small"
                variant="raised"
                disabled={!ethWalletPK || createInRequest}
                onClick={event => this.importWallet()}
              >
                {this.lexicon("Send")}
              </Button>


            </div>

            break;

        }

      }


      let local = {
        "": "",
        "": "",
      }

      output = <div>

        <Typography
          className={classes.paragraph}
        >
          {this.lexicon("You may")} <a
            href="javascript:;"
            onClick={event => {
              event.preventDefault();

              this.setState({
                showForm: showForm === "createForm" ? null : "createForm",
              });
            }}
          >
            {this.lexicon("create new wallet")}
          </a> {this.lexicon("or")} <a
            href="javascript:;"
            onClick={event => {
              event.preventDefault();

              this.setState({
                showForm: showForm === "importForm" ? null : "importForm",
              });
            }}
          >
            {this.lexicon("set existing")}
          </a>.
        </Typography>

        {form}


        {form ?
          <Typography
            className={classes.paragraph}
          >
            <Typography
              color="secondary"
              component="span"
            >
              {this.lexicon("Attention")}!
            </Typography> {this.lexicon("We are not liable for any transactions and losses from ethereum wallets.")}
          </Typography>
          : null
        }


        <Grid
          container
          alignItems="center"
        >
          <HelpIcon
            color="primary"
          /> <a
            href="javascript:;"
            onClick={event => {
              event.preventDefault();

              this.setState({
                showInfo: !showInfo,
              });
            }}
          >
            {showInfo ? this.lexicon("Close") : this.lexicon("Read more")}
          </a>.
        </Grid>

        {showInfo ?
          <div>


            <Typography
              className={classes.paragraph}
            >
              {this.lexicon("This wallet is not a wallet in the literal sense of the word, but a link to your personal address in the system")} <a
                href="https://www.ethereum.org/"
                target="_blank"
                rel="nofollow"
              >
                ethereum
              </a> ({this.lexicon("Read more")} <a
                href="https://ru.wikipedia.org/wiki/Ethereum"
                target="_blank"
                rel="nofollow"
              >{this.lexicon("in wikipedia")}</a>).
            </Typography>

            <Typography
              className={classes.paragraph}
            >
              {this.lexicon("If you don't know exactly what it is and how it works, you'd better not start it now, but try to get a better idea about this system.")}
            </Typography>

            <Typography
              className={classes.paragraph}
            >
            </Typography>

            <Typography
              color="secondary"
              className={classes.paragraph}
            >
              {this.lexicon("We do not store your private keys. The key is needed only to get the address of your wallet and make sure that you have access to it. No key will be shown.")}.
            </Typography>


          </div> : null
        }





      </div>;

    }
    else {
      return null;
    }





    if (!output) {
      return null;
    }


    return (<Paper
      className={[classes.root, checkStatus === true ? "success" : checkStatus === false ? "failure" : ""].join(" ")}
      {...other}
    >

      <Grid
        container
        alignItems="center"
        className={classes.title}
      >
        <WalletIcon
          className={classes.icon}
        />   <Typography
          variant="subheading"
        >
          {title}
        </Typography>
      </Grid>



      {output}


      {actions && actions.length ?
        <div
          className={classes.actions}
        >
          {actions}
        </div>
        : null
      }

      {super.render()}

    </Paper>);
  }
}


export default withStyles(styles)(props => <WalletBalances {...props} />);