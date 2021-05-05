import React, {useEffect, useState} from 'react';
import {Checkbox, FormControlLabel, makeStyles, TextField} from '@material-ui/core';
import {PermissionKeys} from '../../utils/constants';
import {useIntl} from 'react-intl';

const useStyles = makeStyles((theme) => ({
  input: {
    marginBottom: 20
  },
  error: {
    border: '1px solid #f44336'
  }
}));
const unitInitialValue = {
  id: null,
  value: {name: '', permissions: []}
};
export default function RolesForm({model = unitInitialValue, isInvalid, onChange}) {
  const classes = useStyles();
  const [role, setRole] = useState(unitInitialValue);
  const intl = useIntl();
  useEffect(() => {
    setRole(model);
  }, [model]);

  function handleChangeNewRoleName(e) {
    const newRole = {...role, value: {...role.value, name: e.target.value}};
    setRole(newRole);
    onChange && onChange(newRole);
  }

  function handleChangePermission(permission) {
    return e => {
      let newPermissions;
      if (e.target.checked) {
        newPermissions = [...role.value.permissions, permission];
      } else {
        newPermissions = role.value.permissions.filter(item => item !== permission);
      }
      const newRole = {...role, value: {...role.value, permissions: newPermissions}};
      setRole(newRole);
      onChange && onChange(newRole);
    };
  }


  return <>
    <TextField
      value={role.value.name}
      label={intl.formatMessage({
        id: 'roles.form.name',
        defaultMessage: 'Role name'
      })}
      className={classes.input}
      error={isInvalid}
      onChange={handleChangeNewRoleName}
    />
    <div className={`${isInvalid && classes.error}`}>
      {
        Object.values(PermissionKeys).map(permission => {
          return <div key={permission}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={role.value.permissions.includes(permission)}
                  onChange={handleChangePermission(permission)}
                  name="role permission"
                  color="primary"
                />
              }
              label={intl.formatMessage({
                id: `roles.form.permission.${permission}`,
                defaultMessage: permission
              })}
            />
          </div>;
        })
      }
    </div>
  </>;
}
