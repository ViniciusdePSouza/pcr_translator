import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

type Data = {
  data?: any;
  error?: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  if (req.method === 'POST') {
    const { prompt } = req.body;

    try {
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/gpt2',
        {
          inputs: prompt,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      res.status(200).json({ data: response.data });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao chamar a API do Hugging Face' });
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
};

export default handler;
