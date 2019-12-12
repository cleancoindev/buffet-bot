import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';

import { useIcedTxContext } from "../../state/GlobalState";
import { ConditionOrAction, Token } from '../../constants/interfaces';
import { DEFAULT_TOKEN_1, TOKEN_LIST } from '../../constants/constants';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      display: 'block',
    },
    formControl: {
      // marginRight: '24px',
      minWidth: 120,
      width: '100%'
    },
  }),
);

interface TokenSelectProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>  {
  label: string;
  index: number;
  conditionOrAction: ConditionOrAction;
}



export default function TokenSelect(props: TokenSelectProps) {
  const { label, index, conditionOrAction } = props
  const { updateUserInput, icedTxState } = useIcedTxContext();
  console.log(icedTxState)

  const classes = useStyles();
  // @DEV Add a condition that always two different tokens will be shown by default
  const [token, setToken] = React.useState<Token>(DEFAULT_TOKEN_1);

  const [open, setOpen] = React.useState(false);

  const inputLabel = React.useRef<HTMLLabelElement>(null);

  const [labelWidth, setLabelWidth] = React.useState(0);
  React.useEffect(() => {
    setLabelWidth(inputLabel.current!.offsetWidth);
  }, []);

  const handleChange = (event: React.ChangeEvent<{ value: any }>) => {
    const tokenAddress = event.target.value as string;
    const tokenObject = findToken(tokenAddress)
    if (tokenObject === undefined) {
      console.log("ERROR in fetching Token")
      return "ERROR in finding Token"
    }
    setToken(tokenObject);
    // @DEV STORE CORRECT TOKEN ADDRESS IN STATE => ADDRESS IS IMPORANT
    updateUserInput(index, token.address, conditionOrAction)
  };

  const findToken = (address: string) => {
    return TOKEN_LIST.find(singleToken => singleToken.address === address)
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  /* <Button className={classes.button} onClick={handleOpen}>
        Open the select
      </Button> */

  return (


      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel ref={inputLabel} id="demo-simple-select-outlined-label">{label}</InputLabel>
        <Select
          style={{textAlign: 'left'}}
          required
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined-label"
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={token.address}
          onChange={handleChange}
          labelWidth={labelWidth}
        >
          {TOKEN_LIST.map((possibleToken, key) =>
              <MenuItem key={key} value={possibleToken.address}>{possibleToken.symbol}</MenuItem>
          )}
        </Select>
      </FormControl>

  );
}