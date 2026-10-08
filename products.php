<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$products = [
    [
        "id" => 1,
        "sku" => "TF-DUMB-001",
        "name" => "Adjustable Dumbbell Set (20kg)",
        "category" => "Free Weights",
        "price" => 149.99,
        "quantity" => 12,
        "reorderLevel" => 15,
        "status" => "low stock"
    ],
    [
        "id" => 2,
        "sku" => "TF-MAT-002",
        "name" => "Non-Slip Yoga Mat (6mm)",
        "category" => "Accessories",
        "price" => 29.50,
        "quantity" => 45,
        "reorderLevel" => 10,
        "status" => "in stock"
    ],
    [
        "id" => 3,
        "sku" => "TF-TREAD-003",
        "name" => "Pro Treadmill Pro-Run 5000",
        "category" => "Cardio",
        "price" => 899.00,
        "quantity" => 4,
        "reorderLevel" => 5,
        "status" => "low stock"
    ],
    [
        "id" => 4,
        "sku" => "TF-BAND-004",
        "name" => "Resistance Band Set (5 Levels)",
        "category" => "Accessories",
        "price" => 19.99,
        "quantity" => 0,
        "reorderLevel" => 20,
        "status" => "out of stock"
    ],
    [
        "id" => 5,
        "sku" => "TF-BENCH-005",
        "name" => "Multi-Angle Weight Bench",
        "category" => "Strength",
        "price" => 199.99,
        "quantity" => 18,
        "reorderLevel" => 8,
        "status" => "in stock"
    ],
    [
        "id" => 6,
        "sku" => "TF-KETTLE-006",
        "name" => "Cast Iron Kettlebell (16kg)",
        "category" => "Free Weights",
        "price" => 54.00,
        "quantity" => 25,
        "reorderLevel" => 10,
        "status" => "in stock"
    ],
    [
        "id" => 7,
        "sku" => "TF-RACK-007",
        "name" => "Heavy Duty Power Rack",
        "category" => "Strength",
        "price" => 650.00,
        "quantity" => 3,
        "reorderLevel" => 5,
        "status" => "low stock"
    ]
];

echo json_encode(["status" => "success", "data" => $products]);
?>