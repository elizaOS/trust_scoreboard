import { FC } from "react";
import { SignMessage } from '../../components/SignMessage';
import { SendTransaction } from '../../components/SendTransaction';
import { SendVersionedTransaction } from '../../components/SendVersionedTransaction';
import  ProfileTotals  from '../../components/ProfileTotals'; // Changed to named import
import  Socials  from '../../components/Socials'; // Changed to named import
import  ProfileWallets  from '../../components/ProfileWallets'; // Changed to named import

export const ProfileView: FC = () => {
  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <h1 className="text-center text-5xl font-bold text-black bg-clip-text  mt-10 mb-8">
          Profile
        </h1>
        
        {/* Profile Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <ProfileTotals />
          <Socials />
          <ProfileWallets address="your-wallet-address-here" /> {/* Added required prop */}
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
