// app/api/flags.js
export async function GET() {
  const data = [
    { name: "new", id: 1 },
    { name: "signature", id: 2 },
    { name: "choose", id: 3 },
    { name: "offer", id: 4 },
    { name: "sales_ranking", id: 5 },
    { name: "deliverable", id: 6 },
  ];

  const response = {
    code: 200,
    responseStatus: true,
    messages: [],
    response: [
      {
        dataLength: data.length,
        pagination: null,
        data: data,
      },
    ],
  };

  return new Response(JSON.stringify(response), { status: 200 });
}
