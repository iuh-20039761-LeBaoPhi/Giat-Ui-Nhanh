<?php
require_once __DIR__ . "/../../models/API_Models/Order.php";

class OrderController {
    private $order;

    public function __construct() {
        $this->order = new Order();
        header("Content-Type: application/json");
    }

    public function index() {
        echo json_encode($this->order->all());
    }

    public function show($id) {
        echo json_encode($this->order->find($id));
    }

    public function store() {
        header('Content-Type: application/json');

        $input = json_decode(file_get_contents("php://input"), true);

        if (!$input) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid JSON"]);
            return;      
        }

        $data = [
            'customer_name'    => $input['name'],
            'customer_tel'     => $input['phone'],
            'customer_address' => $input['address'],
            'service_id'     => $input['service'],
            'total_price'     => $input['price'],
            'note'             => $input['message'] ?? null,
        ];
        
        $result = $this->order->create($data);

        if ($result) {
            http_response_code(201);
            echo json_encode(["message" => "order created"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Create order failed"]);
        }
    }


    public function update($id) {
        header('Content-Type: application/json');
        $input = json_decode(file_get_contents("php://input"), true);

        if (!$input) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid JSON"]);
            return;      
        }

        $data = [
            'order_status'       => $input['order_status'],
            'transaction_status' => $input['transaction_status'],
            
        ];
        $result = $this->order->update($id, $data);

        if ($result) {
            http_response_code(201);
            echo json_encode(["message" => "Cập nhật đơn hàng thành công"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Cập nhật đơn hàng thất bại"]);
        }
    }

    public function destroy($id) {
        $this->order->delete($id);
        echo json_encode(["message" => "order deleted"]);
    }
}
