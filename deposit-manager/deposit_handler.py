from os import path
from time import time, sleep
import requests
import time
from transactions import get_utxos, refund_utxo

API_URL = "http://localhost:5000/deposit"


class DepositHandler:

    def add_deposits_to_users_balance(self):
        print('add deposit')
        utxos = get_utxos()
        print(len(utxos))
        for utxo_data in utxos:
            print(utxo_data)
        #list_of_addresses_and_amounts = self.get_list_of_addresses_and_amounts()
        # for deposit_data in list_of_addresses_and_amounts:
        #     response = requests.post(API_URL, json=deposit_data)
        #     print(response.json())
        #     response.close()

    def match_utxo(self, utxo_data):
        address = self.get_address(utxo_data['utxo'])

        if address:
            amount = int(utxo_data['amount']) / 1000000
            return {
                'address': address,
                'amount': amount
            }
        else:
            return False

    def get_address(self, utxo):
        # TODO
        # get depositer send address from utxo
        # return
        # "addr1qxx3yeqsfrdlsplyr0pusjhfqevdntqwnndvu9v9utpr0kwud650ngc2zjjlgfqv4d507cumwvk2cx5hqxakhzqk8rlq0ffmkl"
        return "018d12641048dbf807e41bc3c84ae90658d9ac0e9cdace1585e2c237d9dc6ea8f9a30a14a5f4240cab68ff639b732cac1a9701bb6b881638fe"

    def get_list_of_addresses_and_amounts(self):
        # utxos = get_utxos()
        utxos = [
            {'utxo': 'sss', 'amount': 10 * 1000000},
            {'utxo': 'sss', 'amount': 20 * 1000000},
        ]

        send_addresses_and_amounts_list = []

        for utxo_data in utxos:
            send_addresses_and_amount = self.match_utxo(utxo_data=utxo_data)
            if send_addresses_and_amount:
                send_addresses_and_amounts_list.append(send_addresses_and_amount)
        return send_addresses_and_amounts_list





deposit_handler = DepositHandler()
# deposit_handler.add_deposits_to_users_balance()

# while True:
#     deposit_handler.add_deposits_to_users_balance()
#     time.sleep(30)
