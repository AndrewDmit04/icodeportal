import UnVerrifiedAccount from '@/app/components/accounts/UnVerrifiedAccount';
import VerrifiedAccount from '@/app/components/accounts/VerrifiedAccount';
import { getAllInstructors, verifyUser } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs/server';
import React from 'react';

const Staff = async () => {
  const user = await currentUser();
  if (!user) return null;

  const currentStaff = await getAllInstructors({ id: user.id });
  const verifiedStaff = currentStaff.filter((staff: any) => staff.verified);
  const unverifiedStaff = currentStaff.filter((staff: any) => !staff.verified);

  return (
    <div>
      <div>
        <h1>Current iCode staff</h1>
        <div className="flex gap-5 flex-wrap">
          {verifiedStaff.map((item: any) => (
            <VerrifiedAccount
              key={item.id}
              first={item.firstName}
              last={item.lastName}
              img={item.image}
              uid={item.id}
              role={item.role}
              pay={item.pay}
              OID={user.id}
            />
          ))}
        </div>
      </div>
      <div>
        <h1>Awaiting verification</h1>
        <div className="flex gap-5 flex-wrap">
          {unverifiedStaff.map((item: any) => (
            <UnVerrifiedAccount
              key={item.id}
              first={item.firstName}
              last={item.lastName}
              img={item.image}
              uid={item.id}
              OID={user.id}
              role={item.role}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Staff;
