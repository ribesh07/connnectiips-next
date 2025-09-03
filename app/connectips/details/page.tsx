const validateTransaction = async (txnId: string, amount: number) => {
  const res = await fetch("/connectipswebws/api/creditor/validatetxn", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ referenceId: txnId, txnAmt: amount }),
  });

  const data = await res.json();
  console.log("Transaction status:", data);
  return data;
};

export default function TransactionDetailsPage({
  searchParams,
}: {
  searchParams: { TXNID?: string };
}) {
  const TXNID = searchParams.TXNID;

  if (!TXNID) {
    return <div>No Transaction ID provided.</div>;
  }

  return (
    <div>
      <h1>Transaction Details</h1>
      <p>Transaction ID: {TXNID}</p>
      {/* Fetch and display more transaction details from your database as needed */}
      <button
        onClick={ () => {
          const result =  validateTransaction('TxmTqySp5urja6Ge6Xdr', 1000); // Replace 1000 with actual amount
          alert(`Transaction Status: ${result}`);
        }}
      >
        Validate Transaction
      </button>
    </div>
  );
}   