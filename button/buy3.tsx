// @ts-nocheck
import contractABI from "../../contracts/ticket.json";
import {
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Swal from "sweetalert2";
import { sendBuyTokens } from "../../util/send";
import { useContext } from "react";
import { UserContext } from "../../store/context";
const parseEther = (value: number | bigint) => {
  return ethers.utils.parseEther(value.toString());
};

const Buy: React.FC = () => {
  const { ticket_count, stateReset, stateView, setTicketCount } =
    useContext(UserContext);

  const ticketFee = 0.2;
  const [num, setNum] = useState(0);
  const [temp, setTemp] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { isConnected, address } = useAccount();

  const { config } = usePrepareContractWrite({
    address: "0x4Ff0c28bb08044cF583a3563D4013fB12bdFef1e",
    abi: contractABI,
    functionName: "buyTicket",
    args: [parseEther(ticketFee).toString(), num.toString()],
    value: parseEther(ticketFee * num).toString(),
    gasPrice: BigInt("1000000000"),
    gas: BigInt("200000"),
  });

  const { data: useContractWriteData, write } = useContractWrite(config);

  const { data: useWaitForTransactionData } = useWaitForTransaction({
    // isSuccess
    hash: useContractWriteData?.hash,
    onSuccess(data) {
      console.log("Success", data);
      setIsSuccess(true);
    },
  });

  function handleSwalResponse() {
    console.log("this is num: ", num);

    try {
      write();
    } catch (error) {
      console.error("Error buying why?:", error);
    }
  }

  function handleClick() {
    Swal.fire({
      title: "How many tickets will you buy?",
      icon: "question",
      input: "range",
      inputAttributes: {
        min: "1",
        max: "120",
        step: "1",
      },
      inputValue: 10,
    }).then((res) => {
      const selectedValue = Number(res.value);
      setNum(selectedValue);
      setIsLoading(true);
      // console.log("I want value to be: ", selectedValue);
      // console.log("this is what i got: ", num);
    });
  }

  useEffect(() => {
    console.log("useContractWriteData:", useContractWriteData);
    console.log("useWaitForTransactionData:", useWaitForTransactionData);
    console.log("__________________________");

    if (num > 0) {
      setTemp(num);
      handleSwalResponse();
      setNum(0);
    }

    if (isSuccess) {
      sendBuyTokens(address, num)
        .then(async (result) => {
          console.log(result);
          console.log("above is result!!!");
          if (result) {
            Swal.fire(`${result.data.msg}`);
            setTicketCount(ticket_count + parseInt(temp));
            console.log("num setTicket count done?", temp);
            setIsLoading(false);
          }
        })
        .catch((error) => {
          console.error("Error buying tickets:", error);
        });

      Swal.fire({
        icon: "success",
        title: "buyticket success",
        text: `yess`,
      });
      setIsSuccess(false);
    }
    console.log("useWaitForTransactionData", useWaitForTransactionData);

    if (isLoading) {
      Swal.fire({
        icon: "info",
        title: "",
        text: "Please wait while buying tickets...",
        showConfirmButton: false,
        allowOutsideClick: false,
      });
    }
  }, [useContractWriteData, useWaitForTransactionData, isSuccess, num]);

  return (
    <div>
      <button
        className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow w-50 m-5"
        onClick={handleClick}
      >
        "Buy Tickets!!!!"
      </button>
    </div>
  );
};

export default Buy;
