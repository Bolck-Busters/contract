import { ethers } from "ethers";
import contractABI from "../../contracts/ticket.json";
import Swal from "sweetalert2";
import { useAccount } from "wagmi";
import { useState } from "react";

const parseEther = (value: number | bigint) => {
  return ethers.utils.parseEther(value.toString());
};

const Win = () => {
  const { isConnected, address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [winningTickets, setWinningTickets] = useState(0);

  // Contract address and ABI
  const contractAddress = "0x4Ff0c28bb08044cF583a3563D4013fB12bdFef1e";
  const ownerPrivateKey = process.env.REACT_APP_YONG_KEY;
  if (!ownerPrivateKey) {
    throw new Error("Owner private key not found in environment variables");
  }

  // Connect to the Ethereum network
  const provider = new ethers.providers.JsonRpcProvider(
    "https://rpc.sepolia.org"
  );
  const wallet = new ethers.Wallet(ownerPrivateKey, provider);
  const contract = new ethers.Contract(contractAddress, contractABI, wallet);

  // Call the claimPrize function
  const claimPrize = async (gamer: string, amount: ethers.BigNumberish) => {
    if (winningTickets > 0) {
      try {
        setIsLoading(true);

        const transaction = await contract.claimPrize(gamer, amount);
        await transaction.wait();

        const receipt = await provider.getTransactionReceipt(transaction.hash);

        console.log("Prize claimed successfully:", receipt);
        console.log(receipt.status); // success

        Swal.fire({
          icon: "success",
          title: "Prize Claimed",
          text: "Congratulations! You have claimed the prize.",
        });
      } catch (error) {
        console.error("Error claiming prize:", error);

        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while claiming the prize.",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleWin = async () => {
    try {
      if (!address) {
        throw new Error("Address is not valid!");
      }
      if (!(winningTickets > 0)) {
        throw new Error("winningTickets is not valid!");
      }

      setIsLoading(true);

      Swal.fire({
        icon: "info",
        title: "Claiming Prize",
        text: "Please wait while we process your claim...",
        showConfirmButton: false,
        allowOutsideClick: false,
      });

      await claimPrize(address, parseEther(0.5 * winningTickets));
    } catch (error) {
      console.error("Error claiming prize:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while claiming the prize.",
      });
    } finally {
      setIsLoading(false);
      //Swal.close();
    }
  };

  return (
    <div>
      <input
        type="number"
        value={winningTickets}
        onChange={(e) => setWinningTickets(Number(e.target.value))}
        placeholder="Enter winning tickets"
      />
      <button
        className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow w-50 m-5"
        onClick={handleWin}
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Claim winning award!!!!"}
      </button>
    </div>
  );
};

export default Win;
