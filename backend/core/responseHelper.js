const ResponseHelper = {
    // Başarı mesajları
    success: (res, data, message = "Success", statusCode = 200) => {
        return res.status(statusCode).json({
            success: true,
            message,
            data
        });
    },

    error: (res, message = "An error occurred", statusCode = 500, error = null) => {
        const response = {
            success: false,
            message,
        };
        
        if (error && process.env.NODE_ENV === 'development') {
            response.error = error;
        }
        
        return res.status(statusCode).json(response);
    },

    notFound: (res, resource = "Resource") => {
        return ResponseHelper.error(res, `${resource} not found.`, 404);
    },

    unauthorized: (res, message = "Unauthorized for this action") => {
        return ResponseHelper.error(res, message, 403);
    },

    badRequest: (res, message = "Bad Request") => {
        return ResponseHelper.error(res, message, 400);
    },

    conflict: (res, message = "Conflict error") => {
        return ResponseHelper.error(res, message, 409);
    },

    user: {
        notFound: (res) => ResponseHelper.notFound(res, "User"),
        unauthorized: (res) => ResponseHelper.unauthorized(res, "You are not authorized to access this user's information"),
        unauthorizedEdit: (res) => ResponseHelper.unauthorized(res, "You are not authorized to edit this user's information"),
        unauthorizedDelete: (res) => ResponseHelper.unauthorized(res, "You are not authorized to delete this user"),
        emailExists: (res) => ResponseHelper.conflict(res, "Email is already in use"),
        deleted: (res) => ResponseHelper.success(res, null, "User deleted successfully"),
        updated: (res, user) => ResponseHelper.success(res, user, "User updated successfully"),
        retrieved: (res, user) => ResponseHelper.success(res, user, "User retrieved successfully"),
        listRetrieved: (res, users) => ResponseHelper.success(res, users, "User list retrieved successfully")
    },

    product: {
        notFound: (res) => ResponseHelper.notFound(res, "Product"),
        unauthorized: (res) => ResponseHelper.unauthorized(res, "You are not authorized to access this product's information"),
        created: (res, product) => ResponseHelper.success(res, product, "Product track created successfully", 201),
        updated: (res, product) => ResponseHelper.success(res, product, "Product track updated successfully"),
        deleted: (res) => ResponseHelper.success(res, null, "Product track deleted successfully"),
        retrieved: (res, product) => ResponseHelper.success(res, product, "Product track information retrieved successfully"),
        listRetrieved: (res, products) => ResponseHelper.success(res, products, "Tracked products retrieved successfully")
    },

    priceHistory: {
        notFound: (res) => ResponseHelper.notFound(res, "Fiyat geçmişi kaydı"),
        unauthorized: (res) => ResponseHelper.unauthorized(res, "Bu fiyat geçmişi kaydına erişim yetkiniz yok."),
        unauthorizedAdd: (res) => ResponseHelper.unauthorized(res, "Bu ürünün fiyat geçmişini ekleme yetkiniz yok."),
        unauthorizedEdit: (res) => ResponseHelper.unauthorized(res, "Bu fiyat geçmişi kaydını güncelleme yetkiniz yok."),
        unauthorizedDelete: (res) => ResponseHelper.unauthorized(res, "Bu fiyat geçmişi kaydını silme yetkiniz yok."),
        created: (res, priceHistory) => ResponseHelper.success(res, priceHistory, "Fiyat geçmişi başarıyla eklendi.", 201),
        updated: (res, priceHistory) => ResponseHelper.success(res, priceHistory, "Fiyat geçmişi kaydı başarıyla güncellendi."),
        deleted: (res) => ResponseHelper.success(res, null, "Fiyat geçmişi kaydı başarıyla silindi."),
        bulkDeleted: (res, count) => ResponseHelper.success(res, { deletedCount: count }, `${count} adet fiyat geçmişi kaydı başarıyla silindi.`),
        retrieved: (res, priceHistory) => ResponseHelper.success(res, priceHistory, "Fiyat geçmişi kaydı getirildi."),
        listRetrieved: (res, priceHistories) => ResponseHelper.success(res, priceHistories, "Fiyat geçmişi listesi getirildi."),
        productHistoryRetrieved: (res, priceHistories) => ResponseHelper.success(res, priceHistories, "Ürün fiyat geçmişi getirildi.")
    },

    auth: {
        loginSuccess: (res, token) => ResponseHelper.success(res, { token }, "Login successful"),
        registerSuccess: (res, token) => ResponseHelper.success(res, { token }, "Register successful", 201),
        invalidCredentials: (res) => ResponseHelper.badRequest(res, "Invalid credentials"),
        userNotFound: (res) => ResponseHelper.notFound(res, "User not found"),
        emailExists: (res) => ResponseHelper.conflict(res, "Email already in use"),
        registerError: (res, error) => ResponseHelper.error(res, "An error occurred while registering", 500, error)
    }
};

module.exports = ResponseHelper; 