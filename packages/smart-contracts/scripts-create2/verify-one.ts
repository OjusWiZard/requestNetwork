import { computeCreate2DeploymentAddress } from './compute-one-address';
import { HardhatRuntimeEnvironmentExtended } from './types';
import { IDeploymentParams } from './types';
import { create2ContractDeploymentList } from './utils';

export const verifyOne = async (
  contractAddress: string,
  deploymentParams: IDeploymentParams,
  hre: HardhatRuntimeEnvironmentExtended,
): Promise<void> => {
  try {
    await hre.run('verify:verify', {
      address: contractAddress,
      constructorArguments: deploymentParams.constructorArgs,
    });
  } catch (err) {
    console.log(err);
  }
};

export async function VerifyCreate2FromList(hre: HardhatRuntimeEnvironmentExtended): Promise<void> {
  try {
    let address: string;
    await Promise.all(
      create2ContractDeploymentList.map(async (contract) => {
        switch (contract) {
          case 'EthereumProxy':
          case 'EthereumFeeProxy':
            address = await computeCreate2DeploymentAddress({ contract: contract }, hre);
            await verifyOne(address, { contract: contract }, hre);
            break;
          // Other cases to add when necessary
          default:
            throw new Error(
              `The contrat ${contract} is not to be deployed using the CREATE2 scheme`,
            );
        }
      }),
    );
  } catch (e) {
    console.error(e);
  }
}