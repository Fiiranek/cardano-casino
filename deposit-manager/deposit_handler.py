from os import path
from time import time, sleep
import requests
import time
from transactions import get_utxos, refund_utxo

API_URL = "http://localhost:5000/deposit"


class DepositHandler:

    def add_deposits_to_users_balance(self):
        list_of_addresses_and_amounts = self.get_list_of_addresses_and_amounts()
        for deposit_data in list_of_addresses_and_amounts:
            print(deposit_data)
            # response = requests.post(API_URL, json=deposit_data)
            # print(response.json())
            # response.close()

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
        address = "addr1qxx3yeqsfrdlsplyr0pusjhfqevdntqwnndvu9v9utpr0kwud650ngc2zjjlgfqv4d507cumwvk2cx5hqxakhzqk8rlq0ffmkl"
        return address

        # return

    # "018d12641048dbf807e41bc3c84ae90658d9ac0e9cdace1585e2c237d9dc6ea8f9a30a14a5f4240cab68ff639b732cac1a9701bb6b881638fe"

    def get_list_of_addresses_and_amounts(self):
        utxos = get_utxos()
        print(utxos)
        send_addresses_and_amounts_list = []

        for utxo_data in utxos:
            send_addresses_and_amount = self.match_utxo(utxo_data=utxo_data)
            if send_addresses_and_amount:
                send_addresses_and_amounts_list.append(send_addresses_and_amount)
        return send_addresses_and_amounts_list

    def delete_already_deposited_utxos(self,utxos):
        utxos_lis = utxos.map()
        already_deposited_utxos = self.read_deposited_utxos_file()

        for  already_deposited_utxo in already_deposited_utxos:
            if already_deposited_utxo in

    def read_deposited_utxos_file(self):
        deposited_utxos_file = open("deposited_utxos.txt","r")
        deposited_utxos = deposited_utxos_file.readlines()
        for deposited_utxo in deposited_utxos:
            deposited_utxo = deposited_utxo.replace("\n","")
        return deposited_utxos

deposit_handler = DepositHandler()
# deposit_handler.add_deposits_to_users_balance()
deposit_handler.read_deposited_utxos_file()
# while True:
#     deposit_handler.add_deposits_to_users_balance()
#     time.sleep(30)
