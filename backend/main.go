package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

// Product struct สำหรับเก็บข้อมูลสินค้า
type Product struct {
	ID             int     `json:"id"`
	Name           string  `json:"name"`
	SKU            string  `json:"sku"`
	Price          float64 `json:"price"`
	Qty            int     `json:"qty"`
	ImageURL       string  `json:"imageUrl"`                 // เพิ่มฟิลด์สำหรับ URL รูปภาพ
	Category       string  `json:"category"`                 // เพิ่มฟิลด์สำหรับหมวดหมู่
	MaxQty         int     `json:"maxQty"`                   // เพิ่มฟิลด์สำหรับจำนวนสต็อกสูงสุด
	ProductionDate *string `json:"productionDate,omitempty"` // วันที่ผลิต (optional)
	ExpiryDate     *string `json:"expiryDate,omitempty"`     // วันหมดอายุ (optional)
}

// Mock Database (เหมือนใน server.js)
var products = []Product{
	{ID: 1, Name: "เครื่องวัดความดัน Omron HEM-7121", SKU: "OMR-7121", Price: 2500, Qty: 8, ImageURL: "http://localhost:8080/images/omron-hem-7121.jpeg", Category: "เครื่องมือวัดสุขภาพ", MaxQty: 100, ProductionDate: nil, ExpiryDate: nil},
	{ID: 2, Name: "ปรอทวัดไข้ดิจิตอล Terumo C205", SKU: "TRM-C205", Price: 350, Qty: 120, ImageURL: "http://localhost:8080/images/terumo-c205.png", Category: "เครื่องมือวัดสุขภาพ", MaxQty: 150, ProductionDate: nil, ExpiryDate: nil},
	{ID: 3, Name: "เครื่องวัดออกซิเจนปลายนิ้ว Jumper JPD-500D", SKU: "JMP-500D", Price: 990, Qty: 85, ImageURL: "http://localhost:8080/images/jumper-jpd-500d.png", Category: "เครื่องมือวัดสุขภาพ", MaxQty: 80, ProductionDate: nil, ExpiryDate: nil}, // ตัวอย่างสต็อกเกิน
	{ID: 4, Name: "หน้ากากอนามัย 3M (50 ชิ้น)", SKU: "3M-MASK-50", Price: 150, Qty: 500, ImageURL: "http://localhost:8080/images/3m-mask.png", Category: "วัสดุสิ้นเปลืองทางการแพทย์", MaxQty: 2000, ProductionDate: stringPtr("2023-01-15"), ExpiryDate: stringPtr("2026-01-14")},
	{ID: 5, Name: "เจลแอลกอฮอล์ ศิริบัญชา 450ml", SKU: "SRB-GEL-450", Price: 85, Qty: 25, ImageURL: "http://localhost:8080/images/siribuncha-gel.png", Category: "ผลิตภัณฑ์ฆ่าเชื้อ", MaxQty: 300, ProductionDate: stringPtr("2023-06-20"), ExpiryDate: stringPtr("2025-06-19")}, // ตัวอย่างสต็อกน้อย
	{ID: 6, Name: "ชุดตรวจ ATK Gica (Nasal)", SKU: "GICA-ATK-N", Price: 45, Qty: 1000, ImageURL: "http://localhost:8080/images/atk-gica.png", Category: "ชุดตรวจวินิจฉัย", MaxQty: 1000, ProductionDate: stringPtr("2023-09-01"), ExpiryDate: stringPtr("2025-08-31")},
}

// Helper function to create a string pointer
func stringPtr(s string) *string {
	return &s
}

// Handler สำหรับ GET /api/products
func getProductsHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("GET /api/products - Responding with all products.")
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(products)
}

// Handler สำหรับ GET /api/products/:id
func getProductHandler(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, err := strconv.Atoi(params["id"])
	if err != nil {
		http.Error(w, "Invalid product ID", http.StatusBadRequest)
		return
	}

	for _, item := range products {
		if item.ID == id {
			log.Printf("GET /api/products/%d - Found product: %s\n", id, item.Name)
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(item)
			return
		}
	}

	log.Printf("GET /api/products/%d - Product not found.\n", id)
	http.NotFound(w, r)
}

// Handler สำหรับ POST /api/orders (จำลองการสร้าง Order)
func createOrderHandler(w http.ResponseWriter, r *http.Request) {
	var orderData map[string]interface{}
	json.NewDecoder(r.Body).Decode(&orderData)
	log.Printf("POST /api/orders - Received new order: %+v\n", orderData)
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "Order received successfully"})
}

// Handler สำหรับ POST /api/contact (จำลองการรับข้อความ)
func contactHandler(w http.ResponseWriter, r *http.Request) {
	var contactData map[string]string
	json.NewDecoder(r.Body).Decode(&contactData)
	log.Printf("POST /api/contact - Received new message from %s: %s\n", contactData["name"], contactData["message"])
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Message received"})
}

// CORS Middleware เพื่อให้ Frontend เรียกใช้ API ได้
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*") // ใน production ควรระบุ domain ของ frontend
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		// ถ้าเป็น preflight request (OPTIONS) ให้ตอบกลับไปเลย
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	// สร้าง router ใหม่
	r := mux.NewRouter()

	// สร้าง subrouter สำหรับ API endpoints
	api := r.PathPrefix("/api").Subrouter()
	api.HandleFunc("/products", getProductsHandler).Methods("GET")
	api.HandleFunc("/products/{id}", getProductHandler).Methods("GET")
	api.HandleFunc("/orders", createOrderHandler).Methods("POST")
	api.HandleFunc("/contact", contactHandler).Methods("POST")

	// สร้าง File Server สำหรับเสิร์ฟไฟล์จากโฟลเดอร์ public
	// เช่น /images/omron.png จะไปดึงไฟล์จาก ./public/images/omron.png
	r.PathPrefix("/").Handler(http.FileServer(http.Dir("./public/")))

	// เริ่มการทำงานของเซิร์ฟเวอร์บน Port 8080 พร้อมกับ CORS middleware
	port := ":8080"
	log.Printf("Go backend server is running on http://localhost%s\n", port)
	log.Fatal(http.ListenAndServe(port, corsMiddleware(r)))
}
