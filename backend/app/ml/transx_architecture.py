import math

import torch
import torch.nn as nn


class PositionalEncoding(nn.Module):
    def __init__(self, d_model=32, max_len=100):
        super().__init__()

        pe = torch.zeros(max_len, d_model)

        pos = torch.arange(
            0,
            max_len,
            dtype=torch.float,
        ).unsqueeze(1)

        div_term = torch.exp(
            torch.arange(0, d_model, 2).float()
            * (-math.log(10000.0) / d_model)
        )

        pe[:, 0::2] = torch.sin(pos * div_term)
        pe[:, 1::2] = torch.cos(pos * div_term)

        self.register_buffer(
            "pe",
            pe.unsqueeze(0),
        )

    def forward(self, x):
        return x + self.pe[:, :x.size(1)]


class LightweightTransXEncoder(nn.Module):
    def __init__(
        self,
        input_dim=37,
        d_model=32,
        nhead=2,
        num_layers=1,
        dim_feedforward=64,
        dropout=0.1,
    ):
        super().__init__()

        self.proj = nn.Linear(
            input_dim,
            d_model,
        )

        self.pos = PositionalEncoding(
            d_model,
        )

        layer = nn.TransformerEncoderLayer(
            d_model=d_model,
            nhead=nhead,
            dim_feedforward=dim_feedforward,
            dropout=dropout,
            batch_first=True,
        )

        self.transformer = nn.TransformerEncoder(
            layer,
            num_layers=num_layers,
        )

        self.head = nn.Linear(
            d_model,
            7,
        )

    def forward(self, x):
        h = self.transformer(
            self.pos(
                self.proj(x)
            )
        )

        latent = torch.mean(
            h,
            dim=1,
        )

        preds = self.head(
            latent
        )

        return preds, latent