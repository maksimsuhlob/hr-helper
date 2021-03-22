import React from 'react';
import {Button, Container, makeStyles} from '@material-ui/core';
import './style.scss';
import 'firebase/database';
import Header from '../../components/header/Header';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    padding: 30
  },
  rolesList: {
    width: '100%',
    maxWidth: '30%'
  },
  rolesForm: {
    display: 'flex',
    flexDirection: 'column',
    flex: "1 1 auto"
  },

}));

export default function Employee() {
  const classes = useStyles();


  return <div className="roles">
    <Header title={'Employee manager'}/>
    <Container className={classes.container} maxWidth={'lg'}>
      <Button
        color={'primary'}
        variant={'contained'}
        // onClick={handleAddNewRole}
      >
        New employee
      </Button>
    </Container>
    {
      // mode !== Modes.add
      //   ? <Container className={classes.container} maxWidth={'lg'}>
      //     <div className={classes.rolesList}>
      //       {
      //         roleList.map((role, i) => {
      //           return <div key={i} onClick={handleSelectRole(role)}>{role.name}</div>;
      //         })
      //       }
      //     </div>
      //     <div className={classes.rolesForm}>
      //       {
      //         selectedRole && <div>
      //           <TextField
      //             value={selectedRole.name}
      //             disabled
      //             label={'name'}
      //             className={classes.input}
      //           />
      //           {
      //             Object.values(PermissionKeys).map(permission => {
      //               return <div key={permission}>
      //                 <FormControlLabel
      //                   control={
      //                     <Checkbox
      //                       checked={selectedRole.permissions.includes(permission)}
      //                       onChange={handleChangePermission(permission)}
      //                       name="checkedB"
      //                       color="primary"
      //                     />
      //                   }
      //                   label={permission}
      //                 />
      //               </div>;
      //             })
      //           }
      //
      //           <Button
      //             variant={'contained'}
      //             onClick={handleCancelEdit}
      //           >
      //             Cancel
      //           </Button>
      //           <Button
      //             variant={'contained'}
      //             onClick={handleRemoveRole}
      //             color={'secondary'}
      //           >
      //             Remove
      //           </Button>
      //           <Button
      //             color={'primary'}
      //             variant={'contained'}
      //             onClick={handleUpdateRole}
      //             disabled={mode === Modes.read}
      //           >
      //             Update role
      //           </Button>
      //         </div>
      //       }
      //     </div>
      //
      //   </Container>
      //   : <Container className={classes.container} maxWidth={'lg'}>
      //     <div className={classes.rolesForm}>
      //       <TextField
      //         value={newRole.name}
      //         label={'name'}
      //         className={classes.input}
      //         onChange={handleChangeNewRoleName}
      //       />
      //       {
      //         Object.values(PermissionKeys).map(permission => {
      //           return <div key={permission}>
      //             <FormControlLabel
      //               control={
      //                 <Checkbox
      //                   checked={newRole.permissions.includes(permission)}
      //                   onChange={handleChangePermission(permission)}
      //                   name="checkedB"
      //                   color="primary"
      //                 />
      //               }
      //               label={permission}
      //             />
      //           </div>;
      //         })
      //       }
      //
      //       <Button
      //         variant={'contained'}
      //         onClick={handleCancelAddNewRole}
      //       >
      //         Cancel
      //       </Button>
      //       <Button
      //         color={'primary'}
      //         variant={'contained'}
      //         onClick={handleSaveRole}
      //         disabled={mode === Modes.read}
      //       >
      //         Save role
      //       </Button>
      //     </div>
      //   </Container>
    }

  </div>;
};
